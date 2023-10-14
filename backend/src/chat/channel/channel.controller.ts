import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { MuteUserDto } from './dto/mute-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CurrentUser } from '@/auth/auth.decorator';
import { User } from '@prisma/client';
import { AddModeratorDto } from './dto/add-moderator.dto';

@Controller('channel')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.channelService.create(user, createChannelDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.channelService.findAll(user);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.channelService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.channelService.update(user, id, createChannelDto);
  }

  @Patch(':id/join')
  join(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() joinChannelDto: JoinChannelDto,
  ) {
    return this.channelService.join(user, id, joinChannelDto);
  }

  @Delete(':id/leave')
  leave(@CurrentUser() user: User, @Param('id') id: string) {
    return this.channelService.leave(user, id);
  }

  @Patch(':id/moderator')
  addModerator(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() addModeratorDto: AddModeratorDto,
  ) {
    return this.channelService.addModerator(user, id, addModeratorDto);
  }

  @Delete(':id/moderator')
  removeModerator(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() addModeratorDto: AddModeratorDto,
  ) {
    return this.channelService.removeModerator(user, id, addModeratorDto);
  }

  @Patch(':id/ban')
  ban(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() banUserDto: BanUserDto,
  ) {
    return this.channelService.ban(user, id, banUserDto);
  }

  @Patch(':id/mute')
  mute(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() muteUserDto: MuteUserDto,
  ) {
    return this.channelService.mute(user, id, muteUserDto);
  }

  @Delete(':id/ban')
  unban(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() banUserDto: BanUserDto,
  ) {
    return this.channelService.unban(user, id, banUserDto);
  }

  @Delete(':id/mute')
  unmute(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() muteUserDto: MuteUserDto,
  ) {
    return this.channelService.unmute(user, id, muteUserDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.channelService.remove(user, id);
  }
}
