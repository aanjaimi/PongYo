import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaClient } from '@prisma/client';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ChannelModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, PrismaClient],
})
export class ChatModule {}
