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
  async getDirectMessage(
    @Query('userName') username: string,
    @Body() body: any,
  ) {
    const { userName } = body;
    const user = await this.chatService.getUser(userName);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const dm = await this.chatService.getDirectMessage(user, username);
    return dm;
  }
}
