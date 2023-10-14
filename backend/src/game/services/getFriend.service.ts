import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

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
  constructor(private readonly prisma: PrismaService) {}

  async updateUserStats(id: string, vectories: number, defeats: number, pints: number) {
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
    const newPoints = user.points + pints;
    console.log(newVectories);
    console.log(newDefeats);
    console.log(newPoints);
    

    // Update the user's vectories and defeats
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        vectories: newVectories,
        defeats: newDefeats,
        points: newPoints,
      },
    });
  }
}
