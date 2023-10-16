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
import { CurrentUser } from '@/auth/auth.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { MuteUserDto } from './dto/mute-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { AddModeratorDto } from './dto/add-moderator.dto';
import { CreateMessageDto } from './dto/create-message.dto';

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
    @Query('displayName') displayName: string,
  ) {
    const dm = await this.chatService.getDirectMessage(user, displayName);
    return dm;
  }

  // ? from here --------------------------------------------
  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    console.log('createChannelDto =>', createChannelDto);
    return;
    return this.chatService.create(user, createChannelDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.chatService.findAll(user);
  }

  @Get('/channel')
  getChannelByName(@CurrentUser() user: User, @Query('name') name: string) {
    return this.chatService.getChannelByName(user, name);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.chatService.findOne(user, id);
  }

  @Post(':id/messages')
  createMessage(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatService.createMessage(user, id, createMessageDto);
  }

  @Get(':id/messages')
  findMessages(@CurrentUser() user: User, @Param('id') id: string) {
    return this.chatService.findMessages(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.chatService.update(user, id, createChannelDto);
  }

  @Patch(':id/join')
  join(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() joinChannelDto: JoinChannelDto,
  ) {
    return this.chatService.join(user, id, joinChannelDto);
  }

  @Delete(':id/leave')
  leave(@CurrentUser() user: User, @Param('id') id: string) {
    return this.chatService.leave(user, id);
  }

  @Patch(':id/moderator')
  addModerator(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() addModeratorDto: AddModeratorDto,
  ) {
    return this.chatService.addModerator(user, id, addModeratorDto);
  }

  @Delete(':id/moderator')
  removeModerator(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() addModeratorDto: AddModeratorDto,
  ) {
    return this.chatService.removeModerator(user, id, addModeratorDto);
  }

  @Patch(':id/ban')
  ban(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() banUserDto: BanUserDto,
  ) {
    return this.chatService.ban(user, id, banUserDto);
  }

  @Patch(':id/mute')
  mute(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() muteUserDto: MuteUserDto,
  ) {
    return this.chatService.mute(user, id, muteUserDto);
  }

  @Delete(':id/ban')
  unban(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() banUserDto: BanUserDto,
  ) {
    return this.chatService.unban(user, id, banUserDto);
  }

  @Delete(':id/mute')
  unmute(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() muteUserDto: MuteUserDto,
  ) {
    return this.chatService.unmute(user, id, muteUserDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.chatService.remove(user, id);
  }
}
