import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from './auth.constants';
import { JwtAuthPayload } from './interfaces/jwt.interface';
import { RedisService } from '@/redis/redis.service';
import { WsGateway } from '@/ws/ws.gateway';
import { OtpCallbackDTO } from './auth.dto';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    private wsGateway: WsGateway,
  ) {}

  async fortyTwoCallback(user: User, res: Response) {
    const payload = {
      iss: 'Transcendence',
      login: user.login,
      sub: user.login,
    } satisfies JwtAuthPayload;
    let accessToken = '';

    if (user.totp['enabled']) {
      accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('TOTP_JWT_SECRET'),
        expiresIn: 3600, // only valid for 1h
      });
    } else
      accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: AUTH_COOKIE_MAX_AGE,
      });

    res.cookie(AUTH_COOKIE_NAME, accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: (user.totp['enabled'] ? 3600 : AUTH_COOKIE_MAX_AGE) * 1e3,
    });
    res.redirect(this.configService.get('FRONTEND_ORIGIN_PROFILE'));
  }

  async logout(req: Request, res: Response) {
    const accessToken = req.cookies[AUTH_COOKIE_NAME];
    const payload = await this.jwtService.verifyAsync<JwtAuthPayload>(
      accessToken,
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );

    const ex = Math.ceil(payload.exp - Date.now() / 1000);
    await this.redisService.set(accessToken, payload.login, 'EX', ex);
    const { user: currentUser } = req;
    const allSocketIds = Object.keys(
      await this.redisService.hgetall(currentUser.id),
    );
    this.closeConnections(allSocketIds);
    if (allSocketIds.length) {
      await this.redisService.hdel(currentUser.id, ...allSocketIds); // delete all socket session ids
    }
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      expires: new Date(1970), // magic trick !
    });
    res.redirect(this.configService.get('FRONTEND_ORIGIN'));
  }

  private closeConnections(socketIds: string[]) {
    this.wsGateway.io()._nsps.forEach((nsp) => {
      socketIds.forEach((socketId) => {
        const clientSocket = nsp.sockets.get(socketId);
        if (clientSocket) {
          clientSocket.disconnect(true);
        }
      });
    });
  }

  async otpCallback(res: Response, user: User, { token }: OtpCallbackDTO) {
    const secret = user.totp['base32'];
    const isValidToken = speakeasy.totp.verify({
      secret,
      token,
      encoding: 'base32',
    });
    if (!isValidToken) throw new UnauthorizedException();

    const payload = {
      iss: 'Transcendence',
      sub: user.login,
      login: user.login,
    } satisfies JwtAuthPayload;

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: AUTH_COOKIE_MAX_AGE,
    });
    res.cookie(AUTH_COOKIE_NAME, accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: AUTH_COOKIE_MAX_AGE,
    });
    res.redirect(this.configService.get('FRONTEND_ORIGIN'));
  }

  // TODO: remove later
  async getToken(login: string) {
    const payload = {
      iss: 'Transcendence',
      login: login,
      sub: login,
    } satisfies JwtAuthPayload;

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: Math.ceil(AUTH_COOKIE_MAX_AGE),
    });
    return { accessToken };
  }
}
