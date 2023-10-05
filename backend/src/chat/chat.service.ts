import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
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

  async getChannel(channelId: string) {
    const channel = await this.prisma.channel.findUniqueOrThrow({
      where: { id: channelId },
      include: {
        messages: true,
        members: true,
        moderators: true,
        owner: true,
      },
    });
    if (!channel) throw new HttpException('Channel not found', 404);
    return channel;
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
    return newDM;
  }

  async createChannel(
    name: string,
    type: RoomType,
    password: string,
    user: User,
  ) {
    try {
      const channel = await this.prisma.channel.create({
        data: {
          name,
          type,
          isDM: false,
          password,
          owner: {
            connect: { id: user.id },
          },
          members: {
            connect: { id: user.id },
          },
        },
      });
      return channel;
    } catch (err) {
      throw err;
    }
  }

  async joinChannel(channelId: string, channelPassword: string, user: User) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      select: {
        type: true,
        members: true,
        password: true,
        bans: {
          where: { id: user.id },
        },
      },
    });

    // check if channel exists or if its a private channel
    if (!channel || channel.type === RoomType.PRIVATE) {
      throw new HttpException('Channel not found', 404);
    }

    // match password if channel is protected
    if (channel.password && channel.password !== channelPassword) {
      throw new HttpException('Invalid password', 401);
    }

    // check if user is banned
    if (channel.bans.length > 0) {
      throw new HttpException('You are banned', 403);
    }

    // check if user is already a member
    const isMember = channel.members.some((member) => member.id === user.id);
    if (isMember) {
      throw new HttpException('You are already a member', 403);
    }

    // add user to channel
    const updatedChannel = await this.prisma.channel.update({
      select: {
        id: true,
        name: true,
        type: true,
        moderators: true,
      },
      where: { id: channelId },
      data: {
        members: {
          connect: { id: user.id },
        },
      },
    });

    return updatedChannel;
  }

  async leaveChannel(channelId: string, user: User) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      select: {
        type: true,
        members: true,
        owner: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is owner
    if (channel.owner.id === user.id) {
      throw new HttpException('You are the owner', 403);
    }

    // check if user is a member
    const isMember = channel.members.some((member) => member.id === user.id);
    if (!isMember) {
      throw new HttpException('You are not a member', 403);
    }

    // remove user from channel
    const updatedChannel = await this.prisma.channel.update({
      select: {
        id: true,
        name: true,
        type: true,
        moderators: true,
      },
      where: { id: channelId },
      data: {
        members: {
          disconnect: { id: user.id },
        },
      },
    });

    return updatedChannel;
  }
}
