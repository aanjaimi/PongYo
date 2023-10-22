import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryDTO, UserUpdateDTO } from './users.dto';
import { Prisma } from '@prisma/client';
import { buildPagination } from '@/global/global.utils';
import { friendChecking } from '@/friends/friends.helpers';

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
    const { friend: user } = await friendChecking(userId, otherId);
    return user;
  }

  async updateUser(
    userId: string,
    avatar: Express.Multer.File,
    body: UserUpdateDTO,
  ) {
    const path = avatar?.path;
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...body,
        ...(path && {
          avatar: {
            path,
            minio: true,
          },
        }),
      },
    });

    return user;
  }
}
