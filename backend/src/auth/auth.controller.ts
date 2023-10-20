import { Controller, Get, UseGuards, Req, Res, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { FortyTwoGuard } from './guards/42.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }

  // TODO: remove later
  @Get('/token/:login')
  getToken(@Param('login') login: string) {
    return this.authService.getToken(login);
  }
}
