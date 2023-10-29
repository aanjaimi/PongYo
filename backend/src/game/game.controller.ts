import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GameService } from './services/updateStatus.service';
import { CurrentUser } from '@/global/global.decorators';
import { User } from '@prisma/client';

@Controller('/games')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private gameService: GameService) {}

  @Get(':id')
  async findAll(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.gameService.getGamesLog(user, id);
  }
}
