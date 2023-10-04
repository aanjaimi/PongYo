import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Body,
  Param,
  UsePipes,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';
import { CurrentUser } from '@/auth/auth.decorator';
import { User } from '@prisma/client';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('me')
  async getUser(@CurrentUser() user: User) {
    try {
      console.log(user);
      return await this.chatService.getUser(user.login);
    } catch (err) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  // @Get('directMessage')
  // async getDirectMessage(
  //   @Query('userName') username: string,
  //   @Body() body: any,
  // ) {
  //   const { userName } = body;
  //   const user = await this.chatService.getUser(userName);
  //   if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   const dm = await this.chatService.getDirectMessage(user, username);
  //   return dm;
  // }

  // @Post('createChannel')
  // @UsePipes(CreateChatDto)
  // async createChannel(
  //   @CurrentUser() user: User,
  //   @Body() createChatDto: CreateChatDto,
  // ) {
  //   const { name, type, password } = createChatDto;
  //   return this.chatService.createChannel(name, type, password, user);
  // }
}
