import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

// TODO: TBD -> move it to global module!

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    return request.user;
  },
);
