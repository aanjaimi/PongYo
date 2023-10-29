import { Global, Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { NotificationGateway } from './notifications/notification.gateway';

@Global()
@Module({
  providers: [NotificationGateway, WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
