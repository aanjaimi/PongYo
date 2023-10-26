import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Channel, User } from '@prisma/client';
import { RoomType } from '@prisma/client';
import { AddModeratorDto } from './dto/add-moderator.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { MuteUserDto } from './dto/mute-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly chatGateway: ChatGateway,
    private readonly configService: ConfigService,
  ) {}

  private async updateMutesAndBans(channel: Channel) {
    // check for every mute if it has expired
    const mutes = await this.prismaService.mute.findMany({
      where: { channelId: channel.id },
    });
    // if mute has expired, delete it
    mutes.forEach(async (mute) => {
      if (new Date(mute.mutedUntil).getTime() < Date.now()) {
        await this.prismaService.mute.delete({ where: { id: mute.id } });
      }
    });
    const bans = await this.prismaService.ban.findMany({
      where: { channelId: channel.id },
    });
    // if ban has expired, delete it
    bans.forEach(async (ban) => {
      if (new Date(ban.bannedUntil).getTime() < Date.now()) {
        await this.prismaService.ban.delete({ where: { id: ban.id } });
      }
    });
  }

  async getUser(user: User) {
    return await this.prismaService.user.findUnique({
      where: { id: user.id },
      include: {
        channels: {
          select: {
            id: true,
            name: true,
            isDM: true,
            type: true,
            members: true,
            owner: true,
            ownerId: true,
            moderators: true,
            bans: true,
            mutes: true,
            messages: {
              include: {
                user: true,
              },
            },
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

    const otherUser = await this.prismaService.user.findUnique({
      where: { displayName },
    });

    // check if other user exists
    if (!otherUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // check if dm exists
    const dm = await this.prismaService.channel.findFirst({
      select: {
        id: true,
        name: true,
        isDM: true,
        type: true,
        members: true,
        messages: {
          include: {
            user: true,
          },
        },
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
    const newDM = await this.prismaService.channel.create({
      select: {
        id: true,
        name: true,
        type: true,
        isDM: true,
        members: true,
        messages: {
          include: {
            user: true,
          },
        },
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
    const oldChannel = await this.prismaService.channel.findUnique({
      where: { name },
    });
    if (oldChannel) {
      throw new HttpException('Channel name already taken', 403);
    }

    // check if there is a password if channel is protected
    if (type === RoomType.PROTECTED && !password) {
      throw new HttpException('Password required', 400);
    }

    // create channel
    const salt = bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hash(password, salt);
    const channel = await this.prismaService.channel.create({
      select: {
        id: true,
        name: true,
        type: true,
        isDM: true,
        password: true,
        owner: true,
        ownerId: true,
        moderators: true,
        members: true,
        mutes: true,
        bans: true,
        messages: {
          include: {
            user: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      data: {
        name,
        type,
        isDM: false,
        password: password ? hashedPassword : null,
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
    return this.prismaService.channel.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        owner: true,
        ownerId: true,
        moderators: true,
        members: true,
        messages: {
          include: {
            user: true,
          },
        },
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
    const channel = await this.prismaService.channel.findUnique({
      select: {
        id: true,
        name: true,
        type: true,
        members: true,
        moderators: true,
        owner: true,
        ownerId: true,
        bans: true,
        mutes: true,
        messages: {
          include: {
            user: true,
          },
        },
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

    return channel;
  }

  async getChannelByName(user: User, name: string) {
    const channel = await this.prismaService.channel.findUnique({
      select: {
        id: true,
        name: true,
        type: true,
        members: true,
        moderators: true,
        owner: true,
        ownerId: true,
        bans: true,
        mutes: true,
        messages: {
          include: {
            user: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      where: { name },
    });

    // check if channel exists
    if (!channel || channel.type === RoomType.PRIVATE)
      throw new HttpException('Channel not found', 404);

    // check if user is a member
    // const isMember = channel.members.some((member) => member.id === user.id);
    // if (!isMember) throw new HttpException('You are not a member', 403);

    return channel;
  }

  async getAllMessages(user: User, id: string) {
    // check if channel exists
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
      select: {
        members: true,
        messages: {
          include: {
            user: true,
          },
        },
      },
    });

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

  async createMessage(
    user: User,
    id: string,
    createMessageDto: CreateMessageDto,
  ) {
    const { content } = createMessageDto;
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
      select: {
        members: true,
        messages: {
          include: {
            user: true,
          },
        },
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
    const isMuted = channel.mutes.some((mute) => mute.userId === user.id);
    if (isMuted) {
      throw new HttpException('You are muted', 403);
    }

    // create message
    const message = await this.prismaService.message.create({
      select: {
        id: true,
        content: true,
        channelId: true,
        channel: {
          select: {
            id: true,
            name: true,
            type: true,
            isDM: true,
            members: true,
            messages: {
              include: {
                user: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
        userId: true,
        user: true,
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
    const channel = await this.prismaService.channel.findUnique({
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

    const channel = await this.prismaService.channel.findUnique({
      where: { id },
      select: {
        owner: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if channel name is already taken
    const oldChannel = await this.prismaService.channel.findUnique({
      where: { name },
    });
    if (oldChannel) {
      throw new HttpException('Channel name already taken', 403);
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
    const salt = bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedChannel = await this.prismaService.channel.update({
      select: {
        id: true,
        name: true,
        type: true,
        moderators: true,
        owner: true,
        bans: true,
        mutes: true,
        ownerId: true,
        messages: {
          include: {
            user: true,
          },
        },
        members: true,
      },
      where: { id },
      data: {
        name,
        type,
        password: password ? hashedPassword : null,
      },
    });

    this.chatGateway.io().to(`channel-${id}`).emit('update', updatedChannel);

    return updatedChannel;
  }

  async join(user: User, id: string, joinChannelDto: JoinChannelDto) {
    const { password } = joinChannelDto;
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
      select: {
        type: true,
        members: true,
        password: true,
        bans: true,
      },
    });

    // check if channel exists or if its a private channel
    if (!channel || channel.type === RoomType.PRIVATE) {
      throw new HttpException('Channel not found', 404);
    }

    // match password if channel is protected
    if (channel.type === RoomType.PROTECTED) {
      const passwordMatch = await bcrypt.compare(password, channel.password);
      if (channel.password && !passwordMatch) {
        throw new HttpException('Invalid password', 401);
      }
    }

    // check if user is banned
    const isBanned = channel.bans.some((ban) => ban.userId === user.id);
    if (isBanned) {
      throw new HttpException('You are banned', 403);
    }

    // check if user is already a member
    const isMember = channel.members.some((member) => member.id === user.id);
    if (isMember) {
      throw new HttpException('You are already a member', 403);
    }

    // add user to channel
    const updatedChannel = await this.prismaService.channel.update({
      select: {
        id: true,
        name: true,
        type: true,
        members: true,
        moderators: true,
        owner: true,
        ownerId: true,
        bans: true,
        mutes: true,
        messages: {
          include: {
            user: true,
          },
        },
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

    this.chatGateway
      .io()
      .to(`channel-${id}`)
      .emit('join', { user, channelId: id });

    return updatedChannel;
  }

  async leave(user: User, id: string) {
    const channel = await this.prismaService.channel.findUnique({
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
    await this.prismaService.channel.update({
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
    const channel = await this.prismaService.channel.findUnique({
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
    await this.prismaService.channel.update({
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
    const channel = await this.prismaService.channel.findUnique({
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
    await this.prismaService.channel.update({
      where: { id },
      data: {
        moderators: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async ban(user: User, id: string, banUserDto: BanUserDto) {
    const { userId, banDuration } = banUserDto;
    const channel = await this.prismaService.channel.findUnique({
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
    const isBanned = channel.bans.some((ban) => ban.userId === userId);
    if (isBanned) {
      throw new HttpException('User is already banned', 403);
    }

    // ban user
    await this.prismaService.ban.create({
      data: {
        bannedUntil: new Date(Date.now() + banDuration * 1000),
        channel: {
          connect: { id },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    // remove user from channel
    this.kick(user, id, userId);
  }

  async unban(user: User, id: string, banUserDto: BanUserDto) {
    const { userId } = banUserDto;
    const channel = await this.prismaService.channel.findUnique({
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
    const isBanned = channel.bans.some((ban) => ban.userId === userId);
    if (!isBanned) {
      throw new HttpException('User is not banned', 403);
    }

    // unban user
    const updatedChannel = await this.prismaService.channel.update({
      select: {
        id: true,
        name: true,
        type: true,
        mutes: true,
        bans: true,
        moderators: true,
        owner: true,
        ownerId: true,
        members: true,
        messages: {
          include: {
            user: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      where: { id },
      data: {
        bans: {
          disconnect: { id: userId },
        },
      },
    });

    return updatedChannel;
  }

  async mute(user: User, id: string, muteUserDto: MuteUserDto) {
    const { userId, muteDuration } = muteUserDto;
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
      select: {
        owner: true,
        mutes: true,
        moderators: true,
        isDM: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if channel is a dm
    if (channel.isDM) {
      throw new HttpException('Cannot mute in DM', 403);
    }

    // check if user is owner or moderator
    if (
      channel.owner.id !== user.id &&
      !channel.moderators.some((moderator) => moderator.id === user.id)
    ) {
      throw new HttpException('You are not the owner or moderator', 403);
    }

    // check if user is already muted update mute
    const isMuted = channel.mutes.some((mute) => mute.userId === userId);
    const oldMute = channel.mutes.find((mute) => mute.userId === userId);
    if (isMuted) {
      const mute = await this.prismaService.mute.update({
        select: {
          id: true,
          mutedUntil: true,
          channelId: true,
          userId: true,
          updatedAt: true,
          createdAt: true,
        },
        where: { id: oldMute.id },
        data: {
          mutedUntil: new Date(Date.now() + muteDuration * 1000),
        },
      });

      this.chatGateway.io().to(`channel-${id}`).emit('mute', mute);

      return mute;
    }

    // mute user
    const mute = await this.prismaService.mute.create({
      select: {
        id: true,
        mutedUntil: true,
        channelId: true,
        userId: true,
        updatedAt: true,
        createdAt: true,
      },
      data: {
        mutedUntil: new Date(Date.now() + muteDuration * 1000),
        channel: {
          connect: { id },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    this.chatGateway.io().to(`channel-${id}`).emit('mute', mute);

    return mute;
  }

  async unmute(user: User, id: string, userId: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
      select: {
        owner: true,
        mutes: true,
        moderators: true,
        isDM: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if channel is a dm
    if (channel.isDM) {
      throw new HttpException('Cannot unmute in DM', 403);
    }

    // check if user is owner or moderator
    if (
      channel.owner.id !== user.id &&
      !channel.moderators.some((moderator) => moderator.id === user.id)
    ) {
      throw new HttpException('You are not the owner or moderator', 403);
    }

    // check if user is not muted
    const isMuted = channel.mutes.find((mute) => mute.userId === userId);
    if (!isMuted) {
      throw new HttpException('User is not muted', 403);
    }

    // unmute user
    await this.prismaService.mute.delete({
      where: { id: isMuted.id },
    });

    this.chatGateway.io().to(`channel-${id}`).emit('unmute', isMuted);
  }

  async kick(user: User, id: string, userId: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: { id },
      select: {
        owner: true,
        moderators: true,
        members: true,
      },
    });

    // check if channel exists
    if (!channel) {
      throw new HttpException('Channel not found', 404);
    }

    // check if channel is dm
    if (channel.members.length === 2) {
      throw new HttpException('Cannot kick in DM', 403);
    }

    // check if user is owner or moderator
    if (
      channel.owner.id !== user.id &&
      !channel.moderators.some((moderator) => moderator.id === user.id)
    ) {
      throw new HttpException('You are not the owner or moderator', 403);
    }

    // check if user is not a member
    const isMember = channel.members.some((member) => member.id === userId);
    if (!isMember) {
      throw new HttpException('User is not a member', 403);
    }

    // kick user
    await this.prismaService.channel.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });

    this.chatGateway
      .io()
      .to(`channel-${id}`)
      .emit('kick', { userId, channelId: id });
  }

  async remove(user: User, id: string) {
    const channel = await this.prismaService.channel.findUnique({
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
    await this.prismaService.channel.delete({
      where: { id },
    });
  }
}
