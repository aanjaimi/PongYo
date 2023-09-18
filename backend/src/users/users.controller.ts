import { Controller, Get, Res, Req, UseGuards, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from './decorators/currentUser';
import { User } from '@prisma/client';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req: Request, @CurrentUser() currentUser: User, @Param('id') id: string){
    if (id === '@me') return currentUser;
    return this.userService.findOne(req, id);
  }

}
