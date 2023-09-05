import { Controller, Get, UseGuards, Req, Res, Post, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { Response, Request } from 'express';
import { Buffer } from 'buffer';
import { PrismaClient, User } from '@prisma/client';
import { find } from 'rxjs';
import * as speakeasy from 'speakeasy';
import { ConfigService } from '@nestjs/config';

@Controller('oauth')
export class AuthenticationController {
  private prisma: PrismaClient;
  private configService: ConfigService;
  constructor(private AuthenticationService: AuthenticationService) { 
    this.AuthenticationService = AuthenticationService;
    this.configService = new ConfigService();
    this.prisma = new PrismaClient();
  }

  @UseGuards(AuthGuard('oauth2'))
  @Get('callback')
  async LoginCallback(createAuthenticationDto: CreateAuthenticationDto, @Req() req, @Res() res: Response) {
    const user = await this.AuthenticationService.validateOrRegisterUser(req.user) as User;
    const token = await this.AuthenticationService.createJwtToken(user.login);
    res.cookie('jwt', token);
    res.redirect(this.configService.get('FRONTEND_ORIGIN') + `/profile`);
  }

}
