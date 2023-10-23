import { ConflictException, Injectable } from '@nestjs/common';
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
      ...(query.login && {
        OR: [
          { login: { contains: query.login } },
          { displayname: { contains: query.login } },
        ],
      }),
    } satisfies Prisma.UserWhereInput;

    const [totalCount, users] = await this.prismaService.$transaction([
      this.prismaService.user.count({ where }),
      this.prismaService.user.findMany({
        where,
        skip: query.getSkip(),
        take: query.limit,
        // TODO: add sorting by rank!
        orderBy: {
          updatedAt: 'desc',
        },
      }),
    ]);
    return buildPagination(users, query.limit, totalCount);
  }

  async getUser(userId: string, otherId: string) {
    if (otherId === '@me') otherId = userId;
    const { friend: user } = await friendChecking.bind(this)(userId, otherId);
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

    return await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        ...rest,
        ...(path && {
          avatar: {
            path,
            minio: true,
          },
        }),
        totp,
      },
    });
  }
}
