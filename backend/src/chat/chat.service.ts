import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RoomType } from '@prisma/client';

@Injectable()
export class ChatService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUser(userName: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { login: userName },
        include: { channels: { include: { messages: true } } },
      });
      if (!user) throw new HttpException('User not found', 404);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getDirectMessage(user: any, username: string) {
    const dm = await this.prisma.channel.findFirstOrThrow({
      where: {
        AND: [
          { isDM: true },
          {
            members: {
              every: {
                OR: [
                  { displayName: user.displayName },
                  { displayName: username },
                ],
              },
            },
          },
        ],
      },
      include: {
        messages: true,
        members: true,
      },
    });
    if (dm) console.log(dm);
    if (dm) return { status: 200, dm };

    const orgUser = await this.prisma.user.findFirstOrThrow({
      where: { displayName: username },
    });

    const newDM = await this.prisma.channel.create({
      select: {
        id: true,
        name: true,
        isDM: true,
        members: true,
        type: true,
        messages: true,
      },
      data: {
        name: `${user.displayName}-${username}`,
        isDM: true,
        type: RoomType.PRIVATE,
        members: {
          connect: [{ id: user.id }, { id: orgUser.id }],
        },
      },
    });
    console.log('newDM');
    console.log(newDM);
    if (!newDM) throw new HttpException('could not create DM', 500);
    return { status: 200, data: newDM };
  }
}
