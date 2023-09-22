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
import { PrismaClient } from '@prisma/client';

@WebSocketGateway({})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  // /*
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new Error('Token not found');
      }

      const decoded = this.jwtService.verify(token);
      if (!decoded.sub) {
        throw new Error('Invalid token');
      }

      const user = await this.prismaClient.user.findUnique({
        where: { id: decoded.sub },
      });
      if (!user) {
        throw new Error('User not found');
      }
      client.data.user = user;
      client.join(`user-${user.id}`);
      await this.prismaClient.user.update({
        where: { id: user.id },
        data: { userStatus: 'ONLINE' },
      });
    } catch (error) {
      console.log(error);
      throw new WsException(error.message);
    }
  }
  // */

  @SubscribeMessage('onMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'new message',
      content: body,
    });
    return undefined;
  }
}
