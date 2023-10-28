import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { WsGateway } from '@/ws/ws.gateway';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { QueueService } from './services/redis.service';
import { QueueType } from './services/redis.service';
import { RedisService } from '@/redis/redis.service';
import { MatchMakerService } from './services/game.service';

@Injectable()
@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway extends WsGateway {
  constructor(
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
    protected configService: ConfigService,
    private queueService: QueueService,
    protected redisService: RedisService,
    private matchMakerService: MatchMakerService,
  ) {
    super(prismaService, jwtService, configService, redisService);
  }
  private readonly gameMap = new Map<string, Socket>();
  protected server = this.io();

  async handleConnection(client: Socket): Promise<boolean> {
    return super.handleConnection(client).then(() => {
      console.log('game connection');
      if (client.user === undefined) {
        return false;
      }
      client.join(client.user.id);
      this.gameMap.set(client.user.id, client);
      return true;
    });
  }
  async handleDisconnect(client: Socket): Promise<void> {
    return super.handleDisconnect(client).then(() => {
      console.log('game disconnect');
      if(client.user === undefined) {
        return;
      }
      client.leave(client.user.id);
      if (client.user === undefined) {
        return;
      }
      this.gameMap.delete(client.user.id);
      this.queueService.remove(QueueType.NORMAL, client.user.id);
      this.queueService.remove(QueueType.RANKED, client.user.id);
      return;
    });
  }

  @SubscribeMessage('join-queue')
  async handleJoinQueue(client: Socket) {
    console.log('join-queue');
    this.matchMakerService.handleJoinQueue(client, this.gameMap, this.server);
  }
  @SubscribeMessage('join-ranked-queue')
  async handleJoinRankedQueue(client: Socket) {
    this.matchMakerService.handleJoinRankedQueue(
      client,
      this.gameMap,
      this.server,
    );
  }
  @SubscribeMessage('leave-queue')
  async handleLeaveQueue(client: Socket) {
    this.queueService.remove(QueueType.NORMAL, client.user.id);
  }

  @SubscribeMessage('leave-ranked-queue')
  async handleLeaveRankedQueue(client: Socket) {
    this.queueService.remove(QueueType.RANKED, client.user.id);
  }
  @SubscribeMessage('invite')
  async handleInvite(client: Socket, data: { opponent: string }) {
    this.matchMakerService.handleInvite(client, data.opponent, this.gameMap);
  }
  @SubscribeMessage('acceptInvite')
  async handleAcceptInvite(client: Socket, data: { opponent: string }) {
    this.matchMakerService.handleAcceptInvite(
      client,
      data.opponent,
      this.gameMap,
      this.server,
    );
  }
  @SubscribeMessage('declineInvite')
  async handleDeclineInvite(client: Socket) {
    this.redisService.lpop(client.user.login);
  }
  @SubscribeMessage('readyToPlay')
  async handleReadyToPlay(client: Socket) {
    this.gameMap.set(client.user.id, client);
  }
  @SubscribeMessage('busy')
  async handleBusy(client: Socket) {
    this.gameMap.delete(client.user.id);
  }
}
