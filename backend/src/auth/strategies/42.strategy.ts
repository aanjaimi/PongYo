import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { FortyTwoProfile } from '../interfaces/42.interface';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('INTRA_CLIENT_ID'),
      clientSecret: configService.get('INTRA_CLIENT_SECRET'),
      callbackURL: configService.get('INTRA_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: FortyTwoProfile,
  ) {

  console.log('user', profile);
    const user = await this.prismaService.user.upsert({
      where: { login: profile.username },
      create: {
        login: profile.username,
        displayname: profile.displayName,
        email: profile.emails[0].value,
        // userStatus: 'OFFLINE',
        vectories: 0,
        defeats: 0,
        points: 0,
        rowvectories: 0,
        rank: 'UNRANKED',
      },
      update: {},
    });

    return user;
  }
}
