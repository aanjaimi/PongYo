import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { RoomType } from '@prisma/client';

@Injectable()
export class ChatService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUser(user: User) {
    return await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        channels: {
          select: {
            id: true,
            name: true,
            isDM: true,
            type: true,
            members: true,
            messages: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });
  }

  async getDirectMessage(currentUser: User, displayName: string) {
    // check the current user and other user
    if (currentUser.displayName === displayName)
      throw new HttpException('Cannot DM yourself', HttpStatus.BAD_REQUEST);

    const otherUser = await this.prisma.user.findUnique({
      where: { displayName },
    });

    // check if other user exists
    if (!otherUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // check if dm exists
    const dm = await this.prisma.channel.findFirst({
      select: {
        id: true,
        name: true,
        type: true,
        members: true,
        messages: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        isDM: true,
        AND: [
          { members: { some: { id: currentUser.id } } },
          { members: { some: { id: otherUser.id } } },
        ],
      },
    });

    if (dm) return dm;

    // create new dm
    const newDM = await this.prisma.channel.create({
      select: {
        id: true,
        name: true,
        type: true,
        members: true,
        messages: true,
        createdAt: true,
        updatedAt: true,
      },
      data: {
        name: `${currentUser.displayName}-${otherUser.displayName}`,
        type: RoomType.PRIVATE,
        isDM: true,
        members: {
          connect: [{ id: currentUser.id }, { id: otherUser.id }],
        },
        owner: {
          connect: { id: currentUser.id },
        },
      },
    });

    return newDM;
  }
}
