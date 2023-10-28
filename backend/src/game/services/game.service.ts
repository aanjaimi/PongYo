import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { QueueService } from './redis.service';
import { RedisService } from '@/redis/redis.service';
import { GameStarterService } from './gameStarter.service';
import { InviteService } from './updateStatus.service';
import { Injectable } from '@nestjs/common';
import { QueueType } from './redis.service';
import { Socket, Server } from 'socket.io';
import { UserService } from './updateStatus.service';

@Injectable()
export class MatchMakerService {
  constructor(
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
    protected configService: ConfigService,
    private queueService: QueueService,
    private inviteService: InviteService,
    protected redisService: RedisService,
    private gameStarterService: GameStarterService,
    private userService: UserService,
  ) {}
  async handleJoinQueue(
    client: Socket,
    gameMap: Map<string, Socket>,
    server: Server,
  ) {
    const user = client.user;
    if (user === undefined) {
      return;
    }
    if (user.status === 'IN_GAME') {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      return;
    }
    if (await this.queueService.isUserInQueue(QueueType.NORMAL, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      return;
    }
    if (await this.queueService.isUserInQueue(QueueType.RANKED, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      return;
    }
    if ((await this.queueService.getLength(QueueType.NORMAL)) !== 0) {
      const opponent = (await this.queueService.pop(QueueType.NORMAL)).replace(
        /"/g,
        '',
      );
      const oppnentSocket = gameMap.get(opponent);
      if (oppnentSocket === undefined) {
        return;
      }
      if (oppnentSocket) {
        console.log('oppnentSocket');
      }
      client.emit('queue-joined');
      setTimeout(() => {
        oppnentSocket.to(client.user.id).emit('game-start', {
          opp: oppnentSocket.user,
          isRanked: false,
        });
        client.to(oppnentSocket.user.id).emit('game-start', {
          opp: client.user,
          isRanked: false,
        });
        this.userService.updateUserStatus(oppnentSocket.user.id, 'IN_GAME');
        this.userService.updateUserStatus(client.user.id, 'IN_GAME');
        this.gameStarterService.startGame(client, oppnentSocket, false, server);
      }, 1000);
      return;
    }
    client.emit('queue-joined');
    this.queueService.push(QueueType.NORMAL, user.id);
  }
  async handleJoinRankedQueue(
    client: Socket,
    gameMap: Map<string, Socket>,
    server: Server,
  ) {
    const user = client.user;
    if (user === undefined) {
      return;
    }
    if (user.status === 'IN_GAME') {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      return;
    }
    if (await this.queueService.isUserInQueue(QueueType.NORMAL, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      return;
    }
    if (await this.queueService.isUserInQueue(QueueType.RANKED, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      return;
    }
    if ((await this.queueService.getLength(QueueType.RANKED)) !== 0) {
      const opponent = (await this.queueService.pop(QueueType.RANKED)).replace(
        /"/g,
        '',
      );
      const oppnentSocket = gameMap.get(opponent);
      if (oppnentSocket === undefined) {
        return;
      }
      if (oppnentSocket) {
        console.log('oppnentSocket');
      }
      client.emit('queue-joined');
      setTimeout(() => {
        oppnentSocket.to(client.user.id).emit('game-start', {
          opp: oppnentSocket.user,
          isRanked: true,
        });
        client.to(oppnentSocket.user.id).emit('game-start', {
          opp: client.user,
          isRanked: true,
        });
        this.userService.updateUserStatus(oppnentSocket.user.id, 'IN_GAME');
        this.userService.updateUserStatus(client.user.id, 'IN_GAME');
        this.gameStarterService.startGame(client, oppnentSocket, true, server);
      }, 1000);
      return;
    }
    client.emit('queue-joined');
    this.queueService.push(QueueType.RANKED, user.id);
  }
  async handleInvite(
    client: Socket,
    opponent: string,
    gameMap: Map<string, Socket>,
  ) {
    const user = client.user;
    if (user === undefined) {
      return;
    }
    if (user.status === 'IN_GAME') {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      return;
    }
    if (await this.queueService.isUserInQueue(QueueType.NORMAL, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      return;
    }
    if (await this.queueService.isUserInQueue(QueueType.RANKED, user.id)) {
      client.emit('already-in-Queue', {
        msg: 'You are already in queue',
      });
      return;
    }
    const opponentId = await this.inviteService.handleInvite(user.id, opponent);
    console.log(opponent);
    console.log(opponentId);
    if (!opponentId) {
      client.emit('invited-fail', {
        msg: `${opponent} is not your friend`,
      });
      return;
    }
    client.emit('invited-success', {
      opp: opponentId,
    });

    client.to(opponentId).emit('invited', {
      msg: `${client.user.login} invited you`,
      friend: client.user.id,
    });
    await this.redisService.lpush(client.user.login, JSON.stringify(opponent));
  }
  async handleAcceptInvite(
    client: Socket,
    opponent: string,
    gameMap: Map<string, Socket>,
    server: Server,
  ) {
    console.log('handleInvite');
    const opponentSocket = gameMap.get(opponent);
    if (opponentSocket === undefined) {
      console.log('not online');
      return;
    }
    const len = await this.redisService.llen(opponentSocket.user.login);
    if (len === 0) {
      console.log('not invited');
      return;
    }
    if (await this.queueService.isUserInQueue(QueueType.RANKED, opponent)) {
      client.emit('already-in-Queue', {
        msg: 'You ar already in queue',
      });
      return;
    }
    await this.redisService.lpop(opponentSocket.user.login);
    console.log('game-start');
    setTimeout(() => {
      opponentSocket.to(client.user.id).emit('game-start', {
        opp: opponentSocket.user,
        isRanked: false,
      });
      client.to(opponentSocket.user.id).emit('game-start', {
        opp: client.user,
        isRanked: false,
      });
      this.userService.updateUserStatus(opponentSocket.user.id, 'IN_GAME');
      this.userService.updateUserStatus(client.user.id, 'IN_GAME');
      this.gameStarterService.startGame(client, opponentSocket, false, server);
    }, 1000);
  }
}
