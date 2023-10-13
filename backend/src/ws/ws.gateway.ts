import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';

import { JsonWebTokenError } from 'jsonwebtoken';
import { Socket, Server } from 'socket.io';
import { parse as parseCookie } from 'cookie';
import { AUTH_COOKIE_NAME } from '@/auth/auth.constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthPayload } from '@/auth/interfaces/jwt.interface';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  protected readonly _io: Server;
  constructor(
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
    protected configService: ConfigService,
    protected redisService: RedisService,
  ) {}

  @SubscribeMessage('data')
  message() {
    console.log('Data Triggered!');
  }

  async handleConnection(client: Socket) {
    console.log('From Normal HandelConnection');
    try {
      const cookies = parseCookie(client.handshake.headers.cookie || '');
      const accessToken = cookies[AUTH_COOKIE_NAME];

      if (!accessToken)
        throw new WsException(`missing ${AUTH_COOKIE_NAME} cookie.`);
      const isAccessTokenMarkedAsExpired =
        await this.redisService.get(accessToken);
      if (isAccessTokenMarkedAsExpired)
        throw new WsException('acccess token expired.');
      const { login } = await this.jwtService.verifyAsync<JwtAuthPayload>(
        accessToken,
        {
          secret: this.configService.get('JWT_SECRET'),
        },
      );
      const user = await this.prismaService.user.findUnique({
        where: { login },
      });
      if (!user) throw new WsException('user not exists.'); // ?INFO: for security reasons, perhaps it's unnecessary to inform the user about what has occurred.
      client.user = user; // ?INFO: inject the current user into each successfully connected socket client.
      await this.redisService.hset(
        user.id,
        client.id,
        JSON.stringify({ timestamp: Date.now() }),
      );
    } catch (err) {
      if (err instanceof JsonWebTokenError) err = new WsException(err.message);
      else if (!(err instanceof WsException))
        err = new WsException('something went wrong');

      client.emit('error', { message: err.getError() });
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.user) await this.redisService.hdel(client.user.id, client.id);
  }

  /**
   * @description Get the websocket server.
   * @returns socket io instance.
   */

  io() {
    return this._io;
  }
}
