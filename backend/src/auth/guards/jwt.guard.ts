import { RedisService } from '@/redis/redis.service';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AUTH_COOKIE_NAME } from '../auth.constants';
import { IGNORE_OTP } from '../auth.decorators';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private redisService: RedisService,
    private reflector: Reflector,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req: Request = context.switchToHttp().getRequest();
    const otpIgnored = this.reflector.get<boolean>(
      IGNORE_OTP,
      context.getHandler(),
    );

    const accessToken = req.cookies[AUTH_COOKIE_NAME] as string | null;

    const explicitExpiration = await this.redisService.hget(
      `token-${accessToken}`,
      'explicit-expiration',
    );
    let otpNeeded = await this.redisService.hget(
      `token-${accessToken}`,
      'otp-needed',
    );

    // this will let the current user get only his/her data in case otp enabled !
    const isIn = ['@me', req.user.login, req.user.id].includes(
      req.params['id'],
    );
    if (otpNeeded && otpIgnored && isIn) {
      (<User & { otpNeeded?: boolean }>req.user).otpNeeded = true;
      otpNeeded = '0';
    }

    if (explicitExpiration == '1' || otpNeeded == '1')
      throw new UnauthorizedException();

    return true;
  }

  handleRequest(err: unknown, user: unknown): any {
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
