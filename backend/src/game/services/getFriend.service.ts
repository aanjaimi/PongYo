import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { Player } from '@/game/interfaces/Player.interface';
import { Mode } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AchievementService } from './achievements.service';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) { }
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
    console.log("freind");
    console.log(friend);
    console.log(user.friends);
    const isFriend = user.friends.find((f) => f.login === friend);
    if (!isFriend) {
      return undefined;
    }
    console.log('freind found');
    console.log(isFriend);
    return isFriend.id;
  }
}
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private achievementService: AchievementService) { }

  async updateUserRankStats(player: Player, opp: Player, mode: Mode) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: player.id,
      },
    });

    if (!user) {
      // Handle the case where the user is not found
      // You can return an error or throw an exception.
      throw new Error(`User with ID ${player.id} not found.`);
    }
    const vectories = player.userStatus ? 1 : 0;
    const gameInRow = vectories ? user.rowvectories + 1 : 0;
    const isFirstGame = user.vectories + user.defeats === 0;
    const isFirstWin = user.vectories === 0 && vectories === 1;
    const isPerfectVictory = player.score === 10 && opp.score === 0;
    const isPerfectDefeat = player.score === 0 && opp.score === 10;
    const newPoints = Math.max(user.points + player.points, 0);
    const rankScores: Record<string, number> = {
      "Bronze": 0,
      "Silver": 25,
      "Gold": 50,
      "Platinum": 75,
      "Diamond": 100,
      "Master": 125,
      "Grandmaster": 150,
      "Legend": 175,
      "Champion": 200,
    };

    let currentRank = "Bronze";
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
        vectories: user.vectories + vectories,
        defeats: user.defeats + (1 - vectories),
        points: newPoints,
        rank: currentRank,
        rowvectories: gameInRow,
      },
    });
    if (isFirstGame) {
      await this.achievementService.createAchievement(player, "First Game", "Play your first game", "icon-url");
    }
    if (isFirstWin) {
      await this.achievementService.createAchievement(player, "First Win", "Win your first game", "icon-url");
    }
    if (isPerfectVictory) {
      await this.achievementService.createAchievement(player, "Perfect Victory", "Win a game with a score of 10-0", "icon-url");
    }
    if (isPerfectDefeat) {
      await this.achievementService.createAchievement(player, "Perfect Defeat", "Lose a game with a score of 0-10", "icon-url");
    }
    if (user.vectories + vectories === 10) {
      await this.achievementService.createAchievement(player, "Deca-Winner", "Achieve victory in 10 games", "icon-url");
    }
    if (user.vectories + vectories === 20) {
      await this.achievementService.createAchievement(player, "Gold Medalist", "Achieve victory in 20 games", "icon-url");
    }
    if (user.vectories + vectories === 50) {
      await this.achievementService.createAchievement(player, "Platinum Medalist", "Achieve victory in 30 games", "icon-url");
    }
    if (user.vectories + vectories === 100) {
      await this.achievementService.createAchievement(player, "Legend", "Achieve victory in 100 games", "icon-url");
    }
    if (gameInRow == 3) {
      await this.achievementService.createAchievement(player, "Triple Kill", "Achieve 3 victories in a row", "icon-url");
    }
    if (gameInRow == 5) {
      await this.achievementService.createAchievement(player, "Penta Kill", "Achieve 5 victories in a row", "icon-url");
    }
    if (gameInRow == 10) {
      await this.achievementService.createAchievement(player, "Killer", "Achieve 10 victories in a row", "icon-url");
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
    }
    );
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
        userStatus: status as UserStatus
      },
    });
  }
}

