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
import { GameStarterService } from './services/gameStarter.service';
import { GameQueueService } from './services/GameQueue.service';
import { subscribe } from 'diagnostics_channel';
import { InviteService } from './services/getFriend.service';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@Injectable()
@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway extends WsGateway {
  @WebSocketServer() server: Server; // Import the Server class from 'socket.io'
  constructor(
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
    protected configService: ConfigService,
    private queueService: QueueService,
    private inviteService: InviteService,
    // private gameQueueService: GameQueueService, // Inject the GameQueueService
    protected redisService: RedisService,
    private gameStarterService: GameStarterService,
  ) {
    super(prismaService, jwtService, configService, redisService);
  }
  // creat map of id and dockets for each user
  private readonly gameMap = new Map<string, Socket>();

  async handleConnection(client: Socket): Promise<boolean> {
    return super.handleConnection(client).then(() => {
      if(client.user === undefined){
        return ;
      }
      this.gameMap.set(client.user.id, client);
      return true;
    });
  }
  @SubscribeMessage('join-queue')
  async handleJoinQueue(client: Socket) {

    const user = client.user;
    console.log('User');
    if (await this.queueService.isUserInQueue(QueueType.NORMAL, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      // this.queueService.remove(QueueType.NORMAL, client.user.id);
      // return;
    }
    if (await this.queueService.getLength(QueueType.NORMAL) !== 0) {
      const opponent = (await this.queueService.pop(QueueType.NORMAL)).replace(/"/g, '');
      const clientSocket = this.gameMap.get(opponent);
      clientSocket.emit('game-start', {
        opp: client.user,
      });
      client.emit('game-start', {
        opp: clientSocket.user,
      });
      this.gameStarterService.startGame(client, clientSocket, true);
      return;
    }
    client.emit('queue-joined');
    this.queueService.push(QueueType.NORMAL, user.id);
  }

  @SubscribeMessage('leave-queue')
  async handleLeaveQueue(client: Socket) {
    this.queueService.remove(QueueType.NORMAL, client.user.id);
  }

  @SubscribeMessage('join-ranked-queue')
  async handleJoinRankedQueue(client: Socket) {
    const user = client.user;
    if (await this.queueService.isUserInQueue(QueueType.RANKED, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue'
      });
      // this.queueService.remove(QueueType.NORMAL, client.user.id);
      // return;
    }
    if (await this.queueService.getLength(QueueType.RANKED) !== 0) {
      const opponent = (await this.queueService.pop(QueueType.RANKED)).replace(/"/g, '');
      const clientSocket = this.gameMap.get(opponent);
      client.emit('game-start', {
        oppData: opponent,
      });
      clientSocket.emit('game-start', {
        oppData: client.user,
      });
      this.gameStarterService.startGame(client, clientSocket, true);
      return;
    }
    client.emit('queue-joined');
    this.queueService.push(QueueType.RANKED, user.id);
  }

  @SubscribeMessage('leave-ranked-queue')
  async handleLeaveRankedQueue(client: Socket) {
    this.queueService.remove(QueueType.RANKED, client.user.id);
  }
  @SubscribeMessage('invite')
  async handleInvite(client: Socket, data: { opponent: string }) {
    const user = client.user;
    const opponent = data.opponent;
    const opponentId = await this.inviteService.handleInvite(user.id, opponent);
    const opponentSocket = this.gameMap.get(opponentId);
    if (!opponentId) {
      client.emit('invited-fail', {
        msg: `${opponent} is not your friend`,
      });
      return;
    }
    if (!opponentSocket) {
      client.emit('invited-fail', {
        msg: `${opponent} : is not online`,
      });
      return;
    }
    client.emit('invited-success', {
      opp: opponentSocket.user,
    });
    opponentSocket.emit('invited', {
      msg: `${client.user.login} invited you`,
      friend: client.user.id,
    });
    client.join(client.user.id);
    await this.redisService.lpush(client.user.login, JSON.stringify(opponent));
    const len = await this.redisService.llen(client.user.login);
    console.log(typeof (client.user.login));
    console.log(len);
  }
  @SubscribeMessage('acceptInvite')
  async handleAcceptInvite(client: Socket, data: { opponent: string }) {
    console.log('accept');
    const user = client.user;
    const opponent = data.opponent;

    const opponentSocket = this.gameMap.get(opponent);
    console.log(opponent);
    console.log(typeof (opponent));
    if (opponentSocket === undefined) {
      console.log('not online');
      return;
    }
    const len = await this.redisService.llen(opponentSocket.user.login);
    if(len === 0){
      console.log('not invited');
      return;
    }
    
    if (await this.queueService.isUserInQueue(QueueType.RANKED, opponent)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue'
      });
      return;
    }
    await this.redisService.lpop(opponentSocket.user.login);
    client.emit('game-start', {
      opp: opponentSocket.user,
    });
    opponentSocket.emit('game-start', {
      opp: client.user,
    });
    this.gameStarterService.startGame(client, opponentSocket, false);
  }
  @SubscribeMessage('declineInvite')
  async handleDeclineInvite(client: Socket) {
   this.redisService.lpop(client.user.login);
  }
}
