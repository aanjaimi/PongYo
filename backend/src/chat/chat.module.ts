import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaClient } from '@prisma/client';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [PrismaClient],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
