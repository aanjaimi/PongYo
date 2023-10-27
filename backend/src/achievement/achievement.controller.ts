import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AchievementService } from './achievement.service';
import { CurrentUser } from '@/global/global.decorators';
import { User } from '@prisma/client';

@Controller('/achievements')
@UseGuards(JwtAuthGuard)
export class AchievementController {
  constructor(private achievementService: AchievementService) {}

  @Get(':id')
  async findAll(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.achievementService.getAchievements(user, id);
  }
}
