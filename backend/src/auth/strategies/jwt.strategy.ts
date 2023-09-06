import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload): Promise<User> {
    const user = await this.prismaService.user
      .findUnique({
        where: {
          id: payload.sub,
        }
			})
      .catch(() => {
        throw new UnauthorizedException();
      });
    return user;
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies
      && 'jwt' in req.cookies
      && req.cookies['jwt'].lenght > 0)
      return req.cookies['jwt'];
    return null;
  }
}
