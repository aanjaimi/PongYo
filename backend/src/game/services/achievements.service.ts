import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  static rankAchievements = {
    Legend: {
      name: 'Legend',
      description: 'Achieve Legend Rank',
      icon: 'legend-icon-url',
    },
    Champion: {
      name: 'Champion',
      description: 'Achieve Champion Rank',
      icon: 'champion-icon-url',
    },
    Grandmaster: {
      name: 'Grandmaster',
      description: 'Achieve Grandmaster Rank',
      icon: 'grandmaster-icon-url',
    },
    Master: {
      name: 'Master',
      description: 'Achieve Master Rank',
      icon: 'master-icon-url',
    },
    Diamond: {
      name: 'Diamond',
      description: 'Achieve Diamond Rank',
      icon: 'diamond-icon-url',
    },
    Platinum: {
      name: 'Platinum',
      description: 'Achieve Platinum Rank',
      icon: 'platinum-icon-url',
    },
    Gold: {
      name: 'Gold',
      description: 'Achieve Gold Rank',
      icon: 'gold-icon-url',
    },
    Silver: {
      name: 'Silver',
      description: 'Achieve Silver Rank',
      icon: 'silver-icon-url',
    },
    Bronze: {
      name: 'Bronze',
      description: 'Achieve Bronze Rank',
      icon: 'bronze-icon-url',
    },
  };

  async updateAchievement(playerId: string, userRank: string) {
    const achievement = AchievementService.rankAchievements[userRank];
    if (achievement) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: playerId,
        },
        select: {
          displayname: true,
          login: true,
          id: true,
          avatar: true,
          status: true,
          achievement: {
            where: { name: achievement.name }, // Check if the achievement already exists
          },
        },
      });
      if (!user.achievement || user.achievement.length === 0) {
        await this.createAchievement(
          playerId,
          achievement.name,
          achievement.description,
          achievement.icon,
        );
      }
    }
  }
  async createAchievement(playerId, name, description, icon) {
    await this.prisma.user.update({
      where: {
        id: playerId,
      },
      data: {
        achievement: {
          create: [
            {
              name,
              description,
              icon,
            },
          ],
        },
      },
    });
  }
}
