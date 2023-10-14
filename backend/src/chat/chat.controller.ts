import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from '@/auth/auth.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('me')
  async getUser(@CurrentUser() user: User) {
    return this.chatService.getUser(user);
  }

  @Get('directMessage')
  async getDirectMessage(
    @CurrentUser() user: User,
    @Query('displayName') displayName: string,
  ) {
    const dm = await this.chatService.getDirectMessage(user, displayName);
    return dm;
  }
}
