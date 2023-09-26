import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '@prisma/client';
import { CurrentUser } from '@/auth/auth.decorator';

@Controller('/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    if (id === '@me') return this.userService.findOne(currentUser.id);
    return this.userService.findOne(id);
  }
}
