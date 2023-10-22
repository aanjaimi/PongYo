import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '@prisma/client';
import { CurrentUser } from '@/auth/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/search')
  async searchUsers(@Query('value') value: string) {
    const users = (await this.userService.getUsersContainingValue(
      value,
    )) as User[];
    return users;
  }

  @Get('/all')
  async allUsers() {
    const users = (await this.userService.getAllUsers()) as User[];
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    if (id === '@me') return this.userService.findOne(currentUser.id);
    return this.userService.findOne(id);
  }

  @Patch(':id/update')
  async updateDisplayName(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.updateUser(currentUser.id, updateUserDto);
  }
}
