import { Global, Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { ChatGateway } from './chat/chat.gateway';

@Global()
@Module({
  providers: [ChatGateway, WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
