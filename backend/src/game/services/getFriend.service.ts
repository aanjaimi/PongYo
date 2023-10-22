import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { Rank } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AchievementService } from './achievements.service';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}
  async handleInvite(userId: string, friend: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const isFriend = user.friends.find((f) => f.login === friend);
    if (!isFriend) {
      return undefined;
    }
    return isFriend.id;
  }
}
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private achievementService: AchievementService,
  ) {}

  async updateUserRankStats(
    id: string,
    vectories: number,
    defeats: number,
    points: number,
  ) {
    const userWithStat = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: { stat: true },
    });

    const newPoints = Math.max(userWithStat.stat.points + points, 0);

    const rankScores: Record<Rank, number> = {
      UNRANKED: 0,
      BRONZE: 10,
      SILVER: 50,
      GOLD: 100,
      PLATINUM: 500,
      EMERALD: 1000,
      DIAMOND: 1500,
      MASTER: 10000,
      GRANDMASTER: 15000,
      LEGEND: 100000,
      CHAMPION: 150000,
    };

    const currentRank = Object.keys(rankScores).reduce(
      (acc: Rank, value: Rank) => {
        if (newPoints >= rankScores[value]) return value as Rank;
        return acc;
      },
      userWithStat.stat.rank,
    ) as Rank;

    await this.prisma.user.update({
      where: { id },
      data: {
        stat: {
          update: {
            vectories: {
              increment: vectories,
            },
            defeats: {
              increment: defeats,
            },
            points: newPoints,
            rank: currentRank,
          },
        },
      },
    });
    if (isFirstGame) {
      await this.achievementService.createAchievement(
        player,
        'First Game',
        'Play your first game',
        'icon-url',
      );
    }
    if (isFirstWin) {
      await this.achievementService.createAchievement(
        player,
        'First Win',
        'Win your first game',
        'icon-url',
      );
    }
    if (isPerfectVictory) {
      await this.achievementService.createAchievement(
        player,
        'Perfect Victory',
        'Win a game with a score of 10-0',
        'icon-url',
      );
    }
    if (isPerfectDefeat) {
      await this.achievementService.createAchievement(
        player,
        'Perfect Defeat',
        'Lose a game with a score of 0-10',
        'icon-url',
      );
    }
    if (user.vectories + vectories === 10) {
      await this.achievementService.createAchievement(
        player,
        'Deca-Winner',
        'Achieve victory in 10 games',
        'icon-url',
      );
    }
    if (user.vectories + vectories === 20) {
      await this.achievementService.createAchievement(
        player,
        'Gold Medalist',
        'Achieve victory in 20 games',
        'icon-url',
      );
    }
    if (user.vectories + vectories === 50) {
      await this.achievementService.createAchievement(
        player,
        'Platinum Medalist',
        'Achieve victory in 30 games',
        'icon-url',
      );
    }
    if (user.vectories + vectories === 100) {
      await this.achievementService.createAchievement(
        player,
        'Legend',
        'Achieve victory in 100 games',
        'icon-url',
      );
    }
    if (gameInRow == 3) {
      await this.achievementService.createAchievement(
        player,
        'Triple Kill',
        'Achieve 3 victories in a row',
        'icon-url',
      );
    }
    if (gameInRow == 5) {
      await this.achievementService.createAchievement(
        player,
        'Penta Kill',
        'Achieve 5 victories in a row',
        'icon-url',
      );
    }
    if (gameInRow == 10) {
      await this.achievementService.createAchievement(
        player,
        'Killer',
        'Achieve 10 victories in a row',
        'icon-url',
      );
    }
    this.achievementService.updateAchievement(player.id, currentRank);
    await this.prisma.game.upsert({
      where: {
        id: uuidv4(),
      },
      create: {
        userId: player.id,
        opponentId: opp.id,
        mode: mode,
        userScore: player.score,
        oppnentScore: opp.score,
        userStatus: player.userStatus,
        opponentStatus: opp.userStatus,
      },
      update: {},
    });
  }
  async updateUserStatus(id: string, status: UserStatus) {
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        status,
      },
    });
  }
}
