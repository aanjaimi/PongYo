import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WsGateway } from '../ws.gateway';
import { Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/redis/redis.service';
import { SendNotificationPayload } from './chat.interface';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway extends WsGateway {
  constructor(
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
    protected configService: ConfigService,
    protected redisService: RedisService,
  ) {
    super(prismaService, jwtService, configService, redisService);
  }
  @SubscribeMessage('channelCreated')
  channelCreated(client: Socket) {
    // ?INFO: u'll find the currentUser in client.user
    console.log(client.user);
  }

  @OnEvent('chat.send-notification')
  async sendNotification({ sender, receiver, type }: SendNotificationPayload) {
    console.log('Notification Sent Successfully !');
    const receiverActiveSockets = await this.redisService.getUserSockets(
      receiver.id,
    );
    this.io().to(receiverActiveSockets).emit('notification', {
      type,
      sender,
      timestamp: new Date(),
    });
  }
}
