import { Injectable } from '@nestjs/common';
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

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: user.totp['enabled'] ? 3600 : AUTH_COOKIE_MAX_AGE, // only valid for 1h
    });
    if (user.totp['enabled'])
      await this.redisService.hset(`token-${accessToken}`, 'otp-needed', 1);

    res.cookie(AUTH_COOKIE_NAME, accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: (user.totp['enabled'] ? 3600 : AUTH_COOKIE_MAX_AGE) * 1e3,
    });

    res.redirect(this.configService.get('FRONTEND_ORIGIN_PROFILE'));
  }

  async logout(req: Request, res: Response) {
    const accessToken = req.cookies[AUTH_COOKIE_NAME];

    await this.redisService.hset(
      `token-${accessToken}`,
      'explicit-expiration',
      1,
    );
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

  async otpCallback(
    accessToken: string,
    user: User,
    { token }: OtpCallbackDTO,
  ) {
    const secret = user.totp['base32'];
    console.log('Waiting');
    const isValidToken = speakeasy.totp.verify({
      secret,
      token,
      encoding: 'base32',
    });
    console.log(accessToken);
    if (isValidToken)
      await this.redisService.hset(`token-${accessToken}`, 'otp-needed', 0);
    return { valid: isValidToken };
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
