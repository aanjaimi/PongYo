import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [PrismaClient],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
