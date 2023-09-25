import { User } from '@prisma/client';
import { AUTH_COOKIE_NAME } from './auth/auth.constants';

declare module 'express' {
  interface Request {
    user?: User;
    cookies: Record<string, string> & {
      [AUTH_COOKIE_NAME]: string;
    };
  }
}
