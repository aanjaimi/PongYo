import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaClient } from '@prisma/client';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, PrismaClient],
})
export class ChatModule {}
