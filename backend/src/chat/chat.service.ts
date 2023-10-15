import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RoomType } from '@prisma/client';
import { AddModeratorDto } from './dto/add-moderator.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { MuteUserDto } from './dto/mute-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
  ) {}

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
    console.log('user =>', currentUser);
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

  // ? from here --------------------------------------------

  async create(user: User, createChannelDto: CreateChannelDto) {
    const { name, type, password } = createChannelDto;
    // check if channel name is already taken
    const oldChannel = await this.prisma.channel.findUnique({
      where: { name },
    });
    if (oldChannel) {
      throw new HttpException('Channel name already taken', 403);
    }

    // check if there is a password if channel is protected
    if (type === RoomType.PROTECTED && !password) {
      throw new HttpException('Password required', 400);
    }

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
  }

  findAll(user: User) {
    return this.prisma.channel.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        members: true,
        messages: true,
        mutes: true,
        bans: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        members: {
          some: {
            id: user.id,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(user: User, id: string) {
    const channel = await this.prisma.channel.findUnique({
      select: {
        id: true,
        name: true,
        type: true,
        members: true,
        moderators: true,
        owner: true,
        bans: true,
        mutes: true,
        messages: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id },
    });

    // check if channel exists
    if (!channel) throw new HttpException('Channel not found', 404);

    // check if user is a member
    const isMember = channel.members.some((member) => member.id === user.id);
    if (!isMember) throw new HttpException('You are not a member', 403);

    // check if user is owner or moderator
    let isMod = true;
    if (
      channel.owner.id !== user.id &&
      !channel.moderators.some((moderator) => moderator.id === user.id)
    ) {
      isMod = false;
    }

    if (!isMod) {
      const { owner, moderators, bans, mutes, ...rest } = channel;
      return rest;
    }

    return channel;
  }

  async getChannelByName(user: User, name: string) {
    const channel = await this.prisma.channel.findUnique({
      select: {
        id: true,
        name: true,
        type: true,
        members: true,
        moderators: true,
        owner: true,
        bans: true,
        mutes: true,
        messages: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { name },
    });

    // check if channel exists
    if (!channel) throw new HttpException('Channel not found', 404);

    // check if user is a member
    // const isMember = channel.members.some((member) => member.id === user.id);
    // if (!isMember) throw new HttpException('You are not a member', 403);

    // check if user is owner or moderator
    let isMod = true;
    if (
      channel.owner.id !== user.id &&
      !channel.moderators.some((moderator) => moderator.id === user.id)
    ) {
      isMod = false;
    }

    if (!isMod) {
      const { owner, moderators, bans, mutes, ...rest } = channel;
      return rest;
    }

    return channel;
  }

  async createMessage(
    user: User,
    id: string,
    createMessageDto: CreateMessageDto,
  ) {
    const { content } = createMessageDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        members: true,
        messages: true,
        isDM: true,
        mutes: {
          where: { id: user.id },
        },
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is a member
    const isMember = channel.members.some((member) => member.id === user.id);
    if (!isMember) {
      throw new HttpException('You are not a member', 403);
    }

    // check if user is muted
    if (channel.mutes.length > 0) {
      throw new HttpException('You are muted', 403);
    }

    // create message
    const message = await this.prisma.message.create({
      select: {
        id: true,
        content: true,
        channelId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      data: {
        content,
        channel: {
          connect: { id },
        },
        user: {
          connect: { id: user.id },
        },
      },
    });

    // check if channel is a dm
    if (channel.isDM) {
      const otherUser = channel.members.find((member) => member.id !== user.id);
      this.chatGateway.io().to(otherUser.displayName).emit('message', message);
    } else {
      this.chatGateway.io().to(`channel-${id}`).emit('message', message);
    }

    return message;
  }

  async findMessages(user: User, id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        members: true,
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
        mutes: {
          where: { id: user.id },
        },
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is a member
    const isMember = channel.members.some((member) => member.id === user.id);
    if (!isMember) {
      throw new HttpException('You are not a member', 403);
    }

    return channel.messages;
  }

  async update(user: User, id: string, createChannelDto: CreateChannelDto) {
    const { name, type, password } = createChannelDto;

    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        owner: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is owner
    if (channel.owner.id !== user.id) {
      throw new HttpException('You are not the owner', 403);
    }

    //check if there is a password if channel is protected
    if (type === RoomType.PROTECTED && !password) {
      throw new HttpException('Password required', 403);
    }

    // update channel
    const updatedChannel = await this.prisma.channel.update({
      select: {
        id: true,
        name: true,
        type: true,
        moderators: true,
      },
      where: { id },
      data: {
        name,
        type,
        password,
      },
    });

    return updatedChannel;
  }

  async join(user: User, id: string, joinChannelDto: JoinChannelDto) {
    const { password } = joinChannelDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id },
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
    if (channel.password && channel.password !== password) {
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
        members: true,
        messages: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id },
      data: {
        members: {
          connect: { id: user.id },
        },
      },
    });

    return updatedChannel;
  }

  async leave(user: User, id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
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
    await this.prisma.channel.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: user.id },
        },
      },
    });
  }

  async addModerator(user: User, id: string, addModeratorDto: AddModeratorDto) {
    const { userId } = addModeratorDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        owner: true,
        moderators: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is owner
    if (channel.owner.id !== user.id) {
      throw new HttpException('You are not the owner', 403);
    }

    // check if user is already a moderator
    const isModerator = channel.moderators.some(
      (moderator) => moderator.id === userId,
    );
    if (isModerator) {
      throw new HttpException('User is already a moderator', 403);
    }

    // add moderator
    await this.prisma.channel.update({
      where: { id },
      data: {
        moderators: {
          connect: { id: userId },
        },
      },
    });
  }

  async removeModerator(
    user: User,
    id: string,
    addModeratorDto: AddModeratorDto,
  ) {
    const { userId } = addModeratorDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        owner: true,
        moderators: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is owner
    if (channel.owner.id !== user.id) {
      throw new HttpException('You are not the owner', 403);
    }

    // check if user is not a moderator
    const isModerator = channel.moderators.some(
      (moderator) => moderator.id === userId,
    );
    if (!isModerator) {
      throw new HttpException('User is not a moderator', 403);
    }

    // remove moderator
    await this.prisma.channel.update({
      where: { id },
      data: {
        moderators: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async ban(user: User, id: string, banUserDto: BanUserDto) {
    const { userId } = banUserDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        owner: true,
        bans: true,
        moderators: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is owner or moderator
    if (
      channel.owner.id !== user.id &&
      !channel.moderators.some((moderator) => moderator.id === user.id)
    ) {
      throw new HttpException('You are not the owner or moderator', 403);
    }

    // check if the user is not the owner
    if (channel.owner.id === userId) {
      throw new HttpException('You cannot ban the owner', 403);
    }

    // check if user is already banned
    const isBanned = channel.bans.some((ban) => ban.id === userId);
    if (isBanned) {
      throw new HttpException('User is already banned', 403);
    }

    // ban user
    await this.prisma.channel.update({
      where: { id },
      data: {
        bans: {
          connect: { id: userId },
        },
      },
    });

    // remove user from channel
    await this.prisma.channel.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async unban(user: User, id: string, banUserDto: BanUserDto) {
    const { userId } = banUserDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        owner: true,
        bans: true,
        moderators: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is owner or moderator
    if (
      channel.owner.id !== user.id &&
      !channel.moderators.some((moderator) => moderator.id === user.id)
    ) {
      throw new HttpException('You are not the owner or moderator', 403);
    }

    // check if user is not banned
    const isBanned = channel.bans.some((ban) => ban.id === userId);
    if (!isBanned) {
      throw new HttpException('User is not banned', 403);
    }

    // unban user
    await this.prisma.channel.update({
      where: { id },
      data: {
        bans: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async mute(user: User, id: string, muteUserDto: MuteUserDto) {
    const { userId, time } = muteUserDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        owner: true,
        mutes: true,
        moderators: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is owner or moderator
    if (
      channel.owner.id !== user.id &&
      !channel.moderators.some((moderator) => moderator.id === user.id)
    ) {
      throw new HttpException('You are not the owner or moderator', 403);
    }

    // check if user is already muted
    const isMuted = channel.mutes.some((mute) => mute.id === userId);
    if (isMuted) {
      throw new HttpException('User is already muted', 403);
    }

    // mute user
    const updatedChannel = await this.prisma.channel.update({
      select: {
        id: true,
        name: true,
        type: true,
        mutes: true,
      },
      where: { id },
      data: {
        mutes: {
          create: { userId, muteDuration: time },
        },
      },
    });

    return updatedChannel;
  }

  async unmute(user: User, id: string, muteUserDto: MuteUserDto) {
    const { userId } = muteUserDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        owner: true,
        mutes: true,
        moderators: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is owner or moderator
    if (
      channel.owner.id !== user.id &&
      !channel.moderators.some((moderator) => moderator.id === user.id)
    ) {
      throw new HttpException('You are not the owner or moderator', 403);
    }

    // check if user is not muted
    const isMuted = channel.mutes.some((mute) => mute.id === userId);
    if (!isMuted) {
      throw new HttpException('User is not muted', 403);
    }

    // unmute user
    await this.prisma.channel.update({
      where: { id },
      data: {
        mutes: {
          delete: { id: userId },
        },
      },
    });
  }

  async remove(user: User, id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        owner: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if user is owner
    if (channel.owner.id !== user.id) {
      throw new HttpException('You are not the owner', 403);
    }

    // delete channel
    await this.prisma.channel.delete({
      where: { id },
    });
  }
}
