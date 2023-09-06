import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { User } from '@prisma/client';
import { FortyTwoGuard } from './guards/42.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(FortyTwoGuard)
  @Get('42')
  Login42(): void {
  }

  @UseGuards(FortyTwoGuard)
  @Get('/42/callback')
  async LoginCallback(@Req() req, @Res() res: Response) {
    this.authService.callback(<User>req.user, res);
  }
}
