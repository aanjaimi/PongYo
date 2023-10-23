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
import { OtpGuard } from './guards/totp.guard';
import { CurrentUser } from './auth.decorator';
import { User } from '@prisma/client';
import { OtpCallbackDTO } from './auth.dto';
import * as qrCode from 'qrcode';

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
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    this.authService.logout(req, res);
  }

  @UseGuards(OtpGuard)
  @Post('otp')
  async otpCallback(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Body() body: OtpCallbackDTO,
  ) {
    return this.authService.otpCallback(res, user, body);
  }

  // TODO: just for testing we'll remove later
  // remove qrcode dependency
  @UseGuards(OtpGuard)
  @Get('me')
  async me(@CurrentUser() user: User) {
    const otpauthUrl = user.totp['otpauth_url'];
    const data = await qrCode.toDataURL(otpauthUrl);
    return `
    <span>${user.displayname}</span>
    <img src="${data}"/>

    <form action="/auth/otp" method="POST">
      <input type="text" name="token" placeholder="enter otp code"/>
      <submit />
    </form>
    `;
  }

  // TODO: remove later
  @Get('/token/:login')
  getToken(@Param('login') login: string) {
    return this.authService.getToken(login);
  }
}
