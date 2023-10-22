import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '@/auth/auth.decorator';
import { User } from '@prisma/client';
import { NotificationQueryDTO } from './notifications.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query() query: NotificationQueryDTO,
  ) {
    return await this.notificationsService.getNotifications(user.id, query);
  }
}
