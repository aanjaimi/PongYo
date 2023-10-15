import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserStatus } from '@prisma/client';


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
    console.log('friends');
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
  constructor(private readonly prisma: PrismaService) { }

  async updateUserRankStats(id: string, vectories: number, defeats: number, pints: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      // Handle the case where the user is not found
      // You can return an error or throw an exception.
      throw new Error(`User with ID ${id} not found.`);
    }

    // Calculate the new values for vectories and defeats by adding the specified values
    const newVectories = user.vectories + vectories;
    const newDefeats = user.defeats + defeats;
    const newPoints = Math.max(user.points + pints,0);
    const rankScores: Record<string, number> = {
      "Bronze": 0,
      "Silver": 50,
      "Gold": 125,
      "Platinum": 200,
      "Legend": 300,
    };

    // Determine the user's current rank based on their score
    let currentRank = "Bronze";
    for (const rank in rankScores) {
      if (newPoints >= rankScores[rank]) {
        currentRank = rank;
      }
    }


    // Update the user's vectories and defeats
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        vectories: newVectories,
        defeats: newDefeats,
        points: newPoints,
        rank: currentRank,
      },
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
        userStatus: status as UserStatus
      },
    });
  }
}

