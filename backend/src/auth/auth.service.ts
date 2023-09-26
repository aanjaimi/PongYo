import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from './auth.constants';
import { JwtAuthPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async fortyTwoCallback(user: User, res: Response) {
    const payload = {
      iss: 'Transcendence',
      login: user.login,
      sub: user.login,
    } satisfies JwtAuthPayload;

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: AUTH_COOKIE_MAX_AGE,
    });

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: AUTH_COOKIE_MAX_AGE,
    });
    res.redirect(this.configService.get('FRONTEND_ORIGIN'));
  }
}
