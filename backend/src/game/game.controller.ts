// friends.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
// import { FriendsService } from './friends.service';
import { BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CurrentUser } from '@/auth/auth.decorator';
import { User } from '@prisma/client';

// @Controller('game')
// @UseGuards(JwtAuthGuard)
// export class GameController {
//   constructor(private readonly friendsService: FriendsService) {}
//   @Get('search')
//   async searchFriends(@Query('username') username: string) {
//     if (!username) {
//       throw new BadRequestException('Username parameter is required');
//     }
//     return await this.friendsService.searchFriendsByUsername(username);
//   }
// }
