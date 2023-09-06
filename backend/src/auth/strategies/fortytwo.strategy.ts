import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService) {
    super({
      clientID: configService.get('INTRA_CLIENT_ID'),
      clientSecret: configService.get('INTRA_CLIENT_SECRET'),
      callbackURL: configService.get('INTRA_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.prismaService.user.upsert({
      where: { login: profile.username },
      create: {
        login: profile.username,
        displayname: profile.displayName,
        email: profile.emails[0].value,
        userStatus: 'OFFLINE',
        log: {
          create: {
            vectories: 0,
            defeats: 0,
            points: 0,
            rank: "UNRANKED",
            createdAt: new Date(),
            updatedAt: new Date()
          },
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      update: {
        
      }
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}