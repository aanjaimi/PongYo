import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { FortyTwoGuard } from './guards/42.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { User } from '@prisma/client';
import { OtpCallbackDTO } from './auth.dto';
import { AccessToken, CurrentUser } from '@/global/global.decorators';
import { OptAuthGuard } from './guards/otp.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42')
  @UseGuards(FortyTwoGuard)
  fortyTwoLogin() {
    // ? INFO: this function will redirect to intra login page !
  }

  @Get('42/callback')
  @UseGuards(FortyTwoGuard)
  async fortyTwoCallback(@Req() req: Request, @Res() res: Response) {
    this.authService.fortyTwoCallback(req.user, res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    this.authService.logout(req, res);
  }

  @UseGuards(OptAuthGuard)
  @Post('otp')
  async otpCallback(
    @AccessToken() accessToken: string,
    @CurrentUser() user: User,
    @Body() body: OtpCallbackDTO,
  ) {
    return this.authService.otpCallback(accessToken, user, body);
  }

  @UseGuards(OptAuthGuard)
  @Get('@me')
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  // TODO: just for testing we'll remove later
  // remove qrcode dependency
  @UseGuards(OptAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: User) {
    return user;
  }

  // TODO: remove later
  @Get('/token/:login')
  getToken(@Param('login') login: string) {
    return this.authService.getToken(login);
  }
}
