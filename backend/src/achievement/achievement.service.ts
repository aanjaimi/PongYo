import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private prismaService: PrismaService) {}

  async getAchievements(user: User, id: string) {
    return await this.prismaService.achievement.findMany({
      where: {
        userId: id,
      },
    });
  }
}
