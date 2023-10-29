import {
  Controller,
  Get,
  UseGuards,
  Query,
  Patch,
  Delete,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from '@/global/global.decorators';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { MuteUserDto } from './dto/mute-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { AddModeratorDto } from './dto/add-moderator.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChangeOwnerDto } from './dto/change-owner.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('me')
  async getUser(@CurrentUser() user: User) {
    return this.chatService.getUser(user);
  }

  @Get('directMessage')
  async getDirectMessage(
    @CurrentUser() user: User,
    @Query('displayname') displayname: string,
  ) {
    const dm = await this.chatService.getDirectMessage(user, displayname);
    return dm;
  }

  @Post('channel')
  create(
    @CurrentUser() user: User,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.chatService.create(user, createChannelDto);
  }

  @Get('/channels')
  findAll(@CurrentUser() user: User) {
    return this.chatService.findAll(user);
  }

  @Get('/channel')
  getChannelByName(@CurrentUser() user: User, @Query('name') name: string) {
    return this.chatService.getChannelByName(user, name);
  }

  @Get('/channel/:id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.chatService.findOne(user, id);
  }

  @Get('channel/:id/messages')
  getAllMessages(@CurrentUser() user: User, @Param('id') id: string) {
    return this.chatService.getAllMessages(user, id);
  }

  @Post('/channel/:id/messages')
  createMessage(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatService.createMessage(user, id, createMessageDto);
  }

  @Get('/channel/:id/messages')
  findMessages(@CurrentUser() user: User, @Param('id') id: string) {
    return this.chatService.findMessages(user, id);
  }

  @Patch('/channel/:id/owner')
  changeOwner(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() ChangeOwnerDto: ChangeOwnerDto,
  ) {
    return this.chatService.changeOwner(user, id, ChangeOwnerDto);
  }

  @Patch('/channel/:id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.chatService.update(user, id, createChannelDto);
  }

  @Patch('/channel/:id/join')
  join(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() joinChannelDto: JoinChannelDto,
  ) {
    return this.chatService.join(user, id, joinChannelDto);
  }

  @Delete('/channel/:id/leave')
  leave(@CurrentUser() user: User, @Param('id') id: string) {
    return this.chatService.leave(user, id);
  }

  @Patch('/channel/:id/moderators')
  addModerator(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() addModeratorDto: AddModeratorDto,
  ) {
    return this.chatService.addModerator(user, id, addModeratorDto);
  }

  @Delete('/channel/:id/moderators')
  removeModerator(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.chatService.removeModerator(user, id, userId);
  }

  @Patch('/channel/:id/bans')
  ban(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() banUserDto: BanUserDto,
  ) {
    return this.chatService.ban(user, id, banUserDto);
  }

  @Patch('/channel/:id/mutes')
  mute(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() muteUserDto: MuteUserDto,
  ) {
    return this.chatService.mute(user, id, muteUserDto);
  }

  @Delete('/channel/:id/bans')
  unban(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() banUserDto: BanUserDto,
  ) {
    return this.chatService.unban(user, id, banUserDto);
  }

  @Delete('/channel/:id/mutes')
  unmute(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.chatService.unmute(user, id, userId);
  }

  @Delete('/channel/:id/kicks')
  kick(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.chatService.kick(user, id, userId);
  }

  @Delete('/channel/:id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.chatService.remove(user, id);
  }
}
