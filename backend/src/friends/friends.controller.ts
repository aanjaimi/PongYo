import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { FriendService } from './friends.service';
import { User } from '@prisma/client';
import { CurrentUser } from '@/auth/auth.decorator';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { FriendQueryDTO, FriendShipActionDTO } from './friends.dto';

// TODO: for @omoussao
/**
 * - add validation for id param.
 * - implement the friend request functionality.
 * - implement the block functionality.
 * - implement the update friendship functionality, accept friendship or remove it.
 * - in the case of removing friend just switch `friend.state` to `NONE`
 * - implement the get user friends functionality
 * - all the logic of implementations should be done inside service
 * - you should call the `friendChecking` method in top of ur method.
 * - note: for each query operation, such as blocking or sending a friend request, please ensure to update the 'friend.userId' field with the user ID of the person who initiated the operation.
 * */

@Controller('friends')
@ApiCookieAuth()
@ApiTags('friends')
@UseGuards(JwtAuthGuard)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get(':id/users')
  // TODO: get user friends functionality should be done here!
  async findAll(
    @CurrentUser() user: User,
    @Param('id') friendId: string,
    @Query() query: FriendQueryDTO,
  ) {
    // should be paginated
    return await this.friendService.getUserFriends(user.id, friendId, query);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: User, @Param('id') friendId) {
    return await this.friendService.getUserFriendShip(user.id, friendId);
  }
  @Post(':id')
  // TODO: friend request functionality should be done here!
  async create(@CurrentUser() user: User, @Param('id') friendId: string) {
    return await this.friendService.sendFriendRequest(user.id, friendId);
  }

  @Patch(':id')
  // TODO: update friendship functionality should be done here!
  async update(
    @CurrentUser() user: User,
    @Param('id') friendId: string,
    @Query() friendshipAction: FriendShipActionDTO,
  ) {
    return await this.friendService.updateFriendShip(
      user.id,
      friendId,
      friendshipAction,
    );
  }

  // TODO: block functionality should be done here!
  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() user: User, @Param('id') friendId: string) {
    return await this.friendService.blockFriend(user.id, friendId);
  }
}
