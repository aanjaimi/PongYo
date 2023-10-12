import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { WsGateway } from '@/ws/ws.gateway';
import { RedisService } from '@/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway extends WsGateway implements OnGatewayConnection {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly chatService: ChatService,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly redisService: RedisService,
  ) {
    super(prismaService, jwtService, configService, redisService);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    // here we check for user's token and set up socket connection
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, data: any) {
    client.join(`channel-${data.channelId}`);
  }

  @SubscribeMessage('leaveChannel')
  @UseGuards(JwtAuthGuard)
  handleLeaveChannel(client: Socket, data: any) {
    client.leave(`channel-${data.channelId}`);
  }

  @SubscribeMessage('sendMessage')
  @UseGuards(JwtAuthGuard)
  handleSendMessage(client: Socket, data: any) {
    client.to(`channel-${data.channelId}`).emit('message', data);
  }
}
