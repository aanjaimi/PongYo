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
