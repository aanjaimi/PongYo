import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Rank, UserStatus } from '@prisma/client';

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
    console.log('friends');
    console.log(user.friends);
    const isFriend = user.friends.find((f) => f.id === friend);
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
  constructor(private readonly prisma: PrismaService) {}

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
