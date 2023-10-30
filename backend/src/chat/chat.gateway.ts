import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { WsGateway } from '@/ws/ws.gateway';
import { RedisService } from '@/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  extends WsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private server = this.io();
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly redisService: RedisService,
  ) {
    super(prismaService, jwtService, configService, redisService);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    await super.handleConnection(client);
    if (!client.user) return;
    client.join(client.user.login);
    return true;
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    await super.handleDisconnect(client);
  }

  @SubscribeMessage('join-channel')
  handleJoinChannel(client: Socket, data: any) {
    if (!client.user) return;
    // console.log(`${client.user.displayname} join-channel =>${data.channelId}`);
    client.join(`channel-${data.channelId}`);
  }

  @SubscribeMessage('leave-channel')
  handleLeaveChannel(client: Socket, data: any) {
    if (!client.user) return;
    // console.log(`${client.user.displayname} leave-channel =>${data.channelId}`);
    client.leave(`channel-${data.channelId}`);
  }
}
