import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryDTO, UserUpdateDTO } from './users.dto';
import { Prisma, User } from '@prisma/client';
import { buildPagination } from '@/global/global.utils';
import { friendChecking } from '@/friends/friends.helpers';
import * as speakeasy from 'speakeasy';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUsers(userId: string, query: UserQueryDTO) {
    const where = {
      AND: [
        {
          ...(query.login && {
            OR: [
              { login: { contains: query.login, mode: 'insensitive' } },
              { displayname: { contains: query.login, mode: 'insensitive' } },
            ],
          }),
        },
        {
          friends: {
            none: {
              friendId: userId,
              state: 'BLOCKED',
            },
          },
        },
      ],
    } satisfies Prisma.UserWhereInput;

    const users = await this.prismaService.user.findMany({
      where,
      skip: query.getSkip(),
      take: query.limit,
      orderBy: [
        {
          stat: {
            rank: 'desc',
          },
        },
        {
          stat: {
            points: 'desc',
          },
        },
      ],
      select: {
        displayname: true,
        login: true,
        id: true,
        avatar: true,
        status: true,
        stat: true,
      },
    });
    return buildPagination(users, query.limit);
  }

  async getUser(currUser: User, otherId: string) {
    if (['@me', currUser.id, currUser.login].includes(otherId)) return currUser;
    const { friend: user } = await friendChecking.bind(this)(
      currUser.id,
      otherId,
    );
    return user;
  }

  async updateUser(
    user: User,
    avatar: Express.Multer.File,
    body: UserUpdateDTO,
  ) {
    const path = avatar?.path;
    const { tfa, ...rest } = body;
    if (tfa === true && user.totp['enabled']) throw new ConflictException();

    let totp = { enabled: tfa === true };
    if (tfa) {
      const payload = speakeasy.generateSecret({
        name: 'Transcendence',
        issuer: user.login,
      });
      totp = Object.assign(totp, payload);
    }

    const existantUser = await this.prismaService.user.findUnique({
      where: { displayname: rest.displayname },
    });
    if (existantUser && existantUser.id !== user.id) {
      throw new HttpException('Displayname already taken', 403);
    }

    return await this.prismaService.user.update({
      where: { id: user.id },
      select: {
        displayname: true,
        login: true,
        id: true,
        avatar: true,
        status: true,
      },
      data: {
        ...rest,
        ...(path && {
          avatar: {
            path,
            minio: true,
          },
        }),
        ...(tfa !== undefined && { totp }), // TODO: check this !
        isCompleted: true,
      },
    });
  }
}
