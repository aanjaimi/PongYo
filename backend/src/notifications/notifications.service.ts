import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NotificationQueryDTO } from './notifications.dto';
import { Prisma } from '@prisma/client';
import { buildPagination } from '@/global/global.utils';

@Injectable()
export class NotificationsService {
  constructor(private prismaService: PrismaService) {}

  async getNotifications(userId: string, query: NotificationQueryDTO) {
    const where = {
      receiverId: userId,
      type: query.type,
    } satisfies Prisma.NotificationWhereInput;
    console.log(where);
    const [totalCount, notifications] = await this.prismaService.$transaction([
      this.prismaService.notification.count({ where }),
      this.prismaService.notification.findMany({
        where,
        skip: query.getSkip(),
        take: query.limit,
        include: { sender: true },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
    ]);
    return buildPagination(notifications, query.limit, totalCount);
  }
}
