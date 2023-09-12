import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { FortyTwoGuard } from './guards/42.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42')
  @UseGuards(FortyTwoGuard)
  fortyTwoLogin() {
	  console.log('here in the 42 Login');
    // ? INFO: this function will redirect to intra login page !
  }

  @Get('42/callback')
  @UseGuards(FortyTwoGuard)
  async fortyTwoCallback(@Req() req: Request, @Res() res: Response) {
    this.authService.fortyTwoCallback(req.user, res);
  }
}
