import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  static rankAchievements = {
    Legend: {
      name: "Legend",
      description: "Achieve Legend Rank",
      icon: "legend-icon-url",
    },
    Champion: {
      name: "Champion",
      description: "Achieve Champion Rank",
      icon: "champion-icon-url",
    },
    Grandmaster: {
      name: "Grandmaster",
      description: "Achieve Grandmaster Rank",
      icon: "grandmaster-icon-url",
    },
    Master: {
      name: "Master",
      description: "Achieve Master Rank",
      icon: "master-icon-url",
    },
    Diamond: {
      name: "Diamond",
      description: "Achieve Diamond Rank",
      icon: "diamond-icon-url",
    },
    Platinum: {
      name: "Platinum",
      description: "Achieve Platinum Rank",
      icon: "platinum-icon-url",
    },
    Gold: {
      name: "Gold",
      description: "Achieve Gold Rank",
      icon: "gold-icon-url",
    },
    Silver: {
      name: "Silver",
      description: "Achieve Silver Rank",
      icon: "silver-icon-url",
    },
    Bronze: {
      name: "Bronze",
      description: "Achieve Bronze Rank",
      icon: "bronze-icon-url",
    },
  };

  async updateAchievement(playerId: string, userRank: string) {
    const achievement = AchievementService.rankAchievements[userRank];

    if (achievement) {
      await this.prisma.user.update({
        where: {
          id: playerId,
        },
        data: {
          achievement: {
            create: [achievement],
          },
        },
      });
    }
  }
	async  createAchievement(player, name, description, icon) {
		await this.prisma.user.update({
			where: {
				id: player.id,
			},
			data: {
				achievement: {
					create: [
						{
							name,
							description,
							icon, // Replace "icon-url" with the actual URL of the achievement icon
						},
					],
				},
			},
		});
	}
}

