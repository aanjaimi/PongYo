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
    // private gameQueueService: GameQueueService, // Inject the GameQueueService
    protected redisService: RedisService,
    private gameStarterService: GameStarterService,
  ) {
    super(prismaService, jwtService, configService , redisService);
  }
  // creat map of id and dockets for each user
  private readonly gameMap = new Map<string, Socket>();
  @SubscribeMessage('join-queue')
  async handleJoinQueue(client: Socket) {
    
    const user = client.user;
    console.log('User');
    if(await this.queueService.isUserInQueue(QueueType.NORMAL, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue'
      });
      return;
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
      this.gameStarterService.startGame(client,clientSocket, true);
      return;
    }
    client.emit('queue-joined');
    this.gameMap.set(user.id, client);
    this.queueService.push(QueueType.NORMAL, user.id);
  }

  @SubscribeMessage('leave-queue')
  async handleLeaveQueue(client: Socket) {
    this.queueService.remove(QueueType.NORMAL, client.user.id);
  }

  @SubscribeMessage('join-ranked-queue')
  async handleJoinRankedQueue(client: Socket) {
    const user = client.user;
    if(await this.queueService.isUserInQueue(QueueType.RANKED, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue'
      });
      return;
    }
    if (await this.queueService.getLength(QueueType.RANKED) !== 0) {
      const opponent = await this.queueService.pop(QueueType.RANKED);
      client.emit('game-start', {
        oppData: opponent,
      });
      client.to(opponent).emit('game-start', {
        oppData: user,
      });
      return;
    }
    client.emit('queue-joined');
    this.queueService.push(QueueType.RANKED, user.id);
  }

  @SubscribeMessage('leave-ranked-queue')
  async handleLeaveRankedQueue(client: Socket) {
    this.queueService.remove(QueueType.RANKED, client.user.id);
  }
}
