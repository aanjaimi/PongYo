import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Rank, UserStatus } from '@prisma/client';
import { Mode } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AchievementService } from './achievements.service';
import { User } from '@prisma/client';
import { friendChecking } from '@/friends/friends.helpers';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}
  async handleInvite(userId: string, friend: string) {
    // TODO: smazouz test this !
    const { friendShip, friendId } = await friendChecking(
      userId,
      friend,
      this.prisma,
    );
    if (friendShip && friendShip.state === 'ACCEPTED') return friendId;
    return undefined;
  }
}
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private achievementService: AchievementService,
  ) {}

  async updateUserRankStats(player: any, opp: any, mode: Mode) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: player.id,
      },
      include: {
        stat: true,
      },
    });

    if (!user) {
      // Handle the case where the user is not found
      // You can return an error or throw an exception.
      throw new Error(`User with ID ${player.id} not found.`);
    }
    const vectories = player.userStatus ? 1 : 0;
    const gameInRow = vectories ? user.stat.rowVectories + 1 : 0;
    const isFirstGame = user.stat.vectories + user.stat.defeats === 0;
    const isFirstWin = user.stat.vectories === 0 && vectories === 1;
    const isPerfectVictory = player.score === 10 && opp.score === 0;
    const isPerfectDefeat = player.score === 0 && opp.score === 10;
    const newPoints = Math.max(user.stat.points + player.points, 0);
    const rankScores: Record<string, number> = {
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

    let currentRank = 'Bronze';
    for (const rank in rankScores) {
      if (newPoints >= rankScores[rank]) {
        currentRank = rank;
      }
    }
    await this.prisma.user.update({
      where: {
        id: player.id,
      },
      data: {
        stat: {
          update: {
            vectories: {
              increment: vectories,
            },
            defeats: user.stat.defeats + (1 - vectories),
            points: newPoints,
            rank: currentRank as Rank,
            rowVectories: gameInRow,
          },
        },
      },
    });
    if (isFirstGame) {
      await this.achievementService.createAchievement(
        player.id,
        'First Game',
        'Play your first game',
        'icon-url',
      );
    }
    if (isFirstWin) {
      await this.achievementService.createAchievement(
        player.id,
        'First Win',
        'Win your first game',
        'icon-url',
      );
    }
    if (isPerfectVictory) {
      await this.achievementService.createAchievement(
        player.id,
        'Perfect Victory',
        'Win a game with a score of 10-0',
        'icon-url',
      );
    }
    if (isPerfectDefeat) {
      await this.achievementService.createAchievement(
        player.id,
        'Perfect Defeat',
        'Lose a game with a score of 0-10',
        'icon-url',
      );
    }
    if (user.stat.vectories + vectories === 10) {
      await this.achievementService.createAchievement(
        player.id,
        'Deca-Winner',
        'Achieve victory in 10 games',
        'icon-url',
      );
    }
    if (user.stat.vectories + vectories === 20) {
      await this.achievementService.createAchievement(
        player.id,
        'Gold Medalist',
        'Achieve victory in 20 games',
        'icon-url',
      );
    }
    if (user.stat.vectories + vectories === 50) {
      await this.achievementService.createAchievement(
        player.id,
        'Platinum Medalist',
        'Achieve victory in 30 games',
        'icon-url',
      );
    }
    if (user.stat.vectories + vectories === 100) {
      await this.achievementService.createAchievement(
        player.id,
        'Legend',
        'Achieve victory in 100 games',
        'icon-url',
      );
    }
    if (gameInRow == 3) {
      await this.achievementService.createAchievement(
        player.id,
        'Triple Kill',
        'Achieve 3 victories in a row',
        'icon-url',
      );
    }
    if (gameInRow == 5) {
      await this.achievementService.createAchievement(
        player.id,
        'Penta Kill',
        'Achieve 5 victories in a row',
        'icon-url',
      );
    }
    if (gameInRow == 10) {
      await this.achievementService.createAchievement(
        player.id,
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
  async updateUserStatus(id: string, status: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new Error(`User with ID ${id} not found.`);
    }
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        status: status as UserStatus,
      },
    });
  }
}

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}

  async getGamesLog(user: User, id: string) {
    return await this.prismaService.game.findMany({
      where: {
        userId: id,
      },
      include: {
        user: true,
        opponent: true,
      },
    });
  }
}
