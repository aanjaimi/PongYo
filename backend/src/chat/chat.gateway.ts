import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { subscribe } from 'diagnostics_channel';
import { CurrentUser } from '@/auth/auth.decorator';
import { Client } from 'socket.io/dist/client';

@WebSocketGateway({})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    // here we check for user's token and set up socket connection
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(
    @CurrentUser() user: User,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (!user) {
      client.disconnect();
      throw new Error('User not found');
    }
    client.join(`channel-${data.channelId}`);
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(
    @CurrentUser() user: User,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (!user) {
      client.disconnect();
      throw new Error('User not found');
    }
    client.leave(`channel-${data.channelId}`);
  }
}
