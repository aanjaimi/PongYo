import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AUTH_COOKIE_NAME } from '../auth.constants';
import { OtpPayload } from '../interfaces/jwt.interface';

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy, 'totp') {
  constructor(
    private prismaService: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies[AUTH_COOKIE_NAME],
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('TOTP_JWT_SECRET'),
    });
  }

  async validate(payload: OtpPayload) {
    const user = await this.prismaService.user.findFirst({
      where: {
        login: payload.sub,
        totp: {
          path: ['enabled'],
          equals: true,
        },
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
