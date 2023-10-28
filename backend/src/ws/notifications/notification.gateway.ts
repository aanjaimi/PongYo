import { WebSocketGateway } from '@nestjs/websockets';
import { WsGateway } from '../ws.gateway';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/redis/redis.service';
import { SendNotificationPayload } from './notification.interface';

@WebSocketGateway({ namespace: 'notification' })
export class NotificationGateway extends WsGateway {
  constructor(
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
    protected configService: ConfigService,
    protected redisService: RedisService,
  ) {
    super(prismaService, jwtService, configService, redisService);
  }

  @OnEvent('notification.send-notification')
  async sendNotification({
    senderId,
    receiverId,
    type,
  }: SendNotificationPayload) {
    const receiverActiveSockets =
      await this.redisService.getUserSockets(receiverId);
    this.io().to(receiverActiveSockets).emit('notification', {
      type,
      senderId,
      timestamp: new Date(),
    });
  }
}
