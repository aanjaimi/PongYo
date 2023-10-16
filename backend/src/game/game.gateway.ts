import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { GameMaker } from './services/gameMaker.service';
import QueueItem from './interfaces/Queue.interface';
import { WsGateway } from '@/ws/ws.gateway';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/redis/redis.service';
import { InviteService } from '@/game/services/getFriend.service';
import { Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway extends WsGateway {
  constructor(
    private gameMaker: GameMaker,
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
    protected configService: ConfigService,
    protected redisService: RedisService,
    private inviteService: InviteService,
  ) {
    super(prismaService, jwtService, configService, redisService);
  }

  private classicQueue: QueueItem[] = [];
  private rankedQueue: QueueItem[] = [];
  private users: Map<string, Socket> = new Map();

  async handleConnection(client: Socket) {
    if (!(await super.handleConnection(client))) return false;
    this.users.set(client.user.id, client);
    console.log('connected');
    console.log(client.id);
    return true;
  }

  @SubscribeMessage('join-queue')
  hadleJoinQueue(client: Socket) {
    this.gameMaker.addPlayerToQueue(this.classicQueue, {
      client,
      user: client.user,
    },false
    );
  }
  @SubscribeMessage('leave-queue')
  handleLeaveQueue(client: Socket) {
    console.log('leaving');
    this.classicQueue = this.classicQueue.filter(
      (item) => item.client.id !== client.id,
    );
  }
  @SubscribeMessage('join-ranked-queue')
  hadleJoinRankedQueue(client: Socket) {
    console.log('joining ranked');
    this.gameMaker.addPlayerToQueue(this.rankedQueue, {
      client,
      user: client.user,
    },true
    );
  }
  @SubscribeMessage('leave-ranked-queue')
  handleLeaveRankedQueue(client: Socket) {
    console.log('leaving ranked');
    this.rankedQueue = this.rankedQueue.filter(
      (item) => item.client.id !== client.id,
    );
  }
  @SubscribeMessage('invite')
  handleInvite(client: Socket, payload: { username: string }) {
    const { username } = payload; // ?INFO: the username of the user to be invited.
    console.log(username);
    console.log(client.user);
    this.inviteService.handleInvite(client.user.id, username).then((res) => {
      if (res) {
        if (this.users.get(res)) {
          console.log(res);
          client.emit('invited-success', {
            msg: `"${username}" invited successfully`,
          });
          // emite to the invited user
          this.users.get(res).emit('invited', {
            msg: `"${client.user.login}" invited you to a game`,
            friend: client.user.id,
          });
        } else {
          client.emit('invited-fail', { msg: `"${username}" is not online` });
        }
      } else {
        client.emit('invited-fail', {
          msg: `"${username}" is not your friend`,
        });
      }
    });
  }
  @SubscribeMessage('acceptInvite')
  handleAcceptInvite(client: Socket, payload: { friend: string }) {
    const { friend } = payload; // ?INFO: the username of the user to be invited.
    const friendSocket = this.users.get(friend);
    if (friendSocket) {
      // friendSocket.emit('acceptedInvite', {
      //   msg: `"${client.user.login}" accepted your invite`,
      //   friend: client.user.id,
      // });
      this.gameMaker.addPlayerToQueue(this.classicQueue, {
        client: friendSocket,
        user: friendSocket.user,
      }
      ,false);
      this.gameMaker.addPlayerToQueue(this.classicQueue, {
        client,
        user: client.user,
      }
      ,false);
    }
  }
}
