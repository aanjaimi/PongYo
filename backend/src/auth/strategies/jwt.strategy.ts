import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AUTH_COOKIE_NAME } from '../auth.constants';
import { JwtAuthPayload } from '../interfaces/jwt.interface';
import { CookieExtractor } from './cookie-extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: CookieExtractor.extractToken,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtAuthPayload) {
    const user = await this.prismaService.user.findUnique({
      where: {
        login: payload.login,
      },
    });
    if (!user)
    {
      throw new UnauthorizedException();
    }
    return user;
  }

  private static extractJWT(req: Request): string | null {
    const authTokenValue = req.cookies[AUTH_COOKIE_NAME] as string | undefined;
    if (authTokenValue && authTokenValue.length)
      return req.cookies[AUTH_COOKIE_NAME];
    return null;
  }
}
