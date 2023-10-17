import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { AUTH_COOKIE_NAME } from './auth.constants';

// TODO: TBD -> move it to global module!

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const AccessToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    req.headers['authorization'] = req.cookies[AUTH_COOKIE_NAME];
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  },
);
