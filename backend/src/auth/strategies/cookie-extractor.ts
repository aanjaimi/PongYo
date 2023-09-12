import { Request } from 'express';
import { AUTH_COOKIE_NAME } from '../auth.constants';

export class CookieExtractor {
  static extractToken(req: Request): string | null {
    if (req && req.cookies) {
      return req.cookies[AUTH_COOKIE_NAME];
    }
    return null;
  }
}
