import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('me')
  async getUser(@Query('userName') userName: string, @Res() res: Response) {
    try {
      const user = await this.chatService.getUser(userName);
      res.send(user);
    } catch (err) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('directMessage')
  async joinDirectMessage(
    @Query('userName') username: string,
    @Body() body: any,
  ) {
    const { userName } = body;
    const user = await this.chatService.getUser(userName);
    if (!user) throw new Error('User not found');
    const dm = await this.chatService.getDirectMessage(user, username);
    return dm;
  }
}
