import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Body,
  Param,
  UsePipes,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from '@/auth/auth.decorator';
import { User } from '@prisma/client';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { MuteUserDto } from './dto/mute-user.dto';
import { FortyTwoGuard } from '@/auth/guards/42.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('me')
  async getUser(@CurrentUser() user: User) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  @Get('channel/:channelId')
  async getChannel(
    @CurrentUser() user: User,
    @Param('channelId') channelId: string,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return await this.chatService.getChannel(channelId, user);
  }

  @Get('directMessage')
  async getDirectMessage(
    @CurrentUser() user: User,
    @Body('displayName') displayName: any,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const dm = await this.chatService.getDirectMessage(user, displayName);
    return dm;
  }

  @Post('createChannel')
  @UsePipes(CreateChannelDto)
  async createChannel(
    @CurrentUser() user: User,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { name, type, password } = createChannelDto;
    return this.chatService.createChannel(name, type, password, user);
  }

  @Delete('deleteChannel/:channelId')
  async deleteChannel(
    @CurrentUser() user: User,
    @Param('channelId') channelId: string,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.chatService.deleteChannel(channelId, user);
  }

  @Post('joinChannel')
  @UsePipes(JoinChannelDto)
  async joinChannel(
    @CurrentUser() user: User,
    @Body() joinChannelDto: JoinChannelDto,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { channelId, password } = joinChannelDto;
    return this.chatService.joinChannel(channelId, password, user);
  }

  @Delete('leaveChannel/:channelId')
  async leaveChannel(
    @CurrentUser() user: User,
    @Param('channelId') channelId: string,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.chatService.leaveChannel(channelId, user);
  }

  @Post('updateChannel/:channelId')
  @UsePipes(CreateChannelDto)
  async updateChannel(
    @CurrentUser() user: User,
    @Param('channelId') channelId: string,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.chatService.updateChannel(channelId, user, createChannelDto);
  }

  @Post('addModerator/:channelId')
  async addModerator(
    @CurrentUser() user: User,
    @Param('channelId') channelId: string,
    @Body('moderatorId') moderatorId: string,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.chatService.addModerator(channelId, user, moderatorId);
  }

  @Delete('removeModerator/:channelId')
  async removeModerator(
    @CurrentUser() user: User,
    @Param('channelId') channelId: string,
    @Body('moderatorId') moderatorId: string,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.chatService.removeModerator(channelId, user, moderatorId);
  }

  @Post('banUser')
  @UsePipes(BanUserDto)
  async banUser(@CurrentUser() user: User, @Body() banUserDto: BanUserDto) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { channelId, userId } = banUserDto;
    return this.chatService.banUser(channelId, user, userId);
  }

  @Delete('unbanUser')
  @UsePipes(BanUserDto)
  async unbanUser(@CurrentUser() user: User, @Body() banUserDto: BanUserDto) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { channelId, userId } = banUserDto;
    return this.chatService.unbanUser(channelId, user, userId);
  }

  @Post('muteUser')
  @UsePipes(MuteUserDto)
  async muteUser(@CurrentUser() user: User, @Body() muteUserDto: MuteUserDto) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { channelId, userId, time } = muteUserDto;
    return this.chatService.muteUser(channelId, user, userId, time);
  }

  @Delete('unmuteUser')
  @UsePipes(MuteUserDto)
  async unmuteUser(
    @CurrentUser() user: User,
    @Body() muteUserDto: MuteUserDto,
  ) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { channelId, userId } = muteUserDto;
    return this.chatService.unmuteUser(channelId, user, userId);
  }
}
