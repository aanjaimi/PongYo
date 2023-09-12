import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard'

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserByUserName(@Req() req: Request, @Res() res: Response){
    this.profileService.validateUser(req, res);
  }
}
