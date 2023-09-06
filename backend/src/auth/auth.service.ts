import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private configService: ConfigService) {}

  async callback(user: User, res: Response) {
    const payload = {
      iss: 'Transcendence',
      login: user.login,
      sub: user.login,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1d',
    });

    res.cookie('jwt', token, { httpOnly: true });
    res.redirect(this.configService.get('FRONTEND_ORIGIN') + `/profile`);
  }
}
