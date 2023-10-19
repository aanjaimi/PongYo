import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { FortyTwoProfile } from '../interfaces/42.interface';
import { User } from '@prisma/client';

type UserWithAvatar = User & {
  avatar: {
    minio: boolean;
    path: string;
  };
};

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private prismaService: PrismaService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('INTRA_CLIENT_ID'),
      clientSecret: configService.get('INTRA_CLIENT_SECRET'),
      callbackURL: configService.get('INTRA_CALLBACK_URL'),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: FortyTwoProfile,
  ) {
    const {
      image: { link: avatarPath },
    } = profile._json;
    const user = (await this.prismaService.user.upsert({
      where: { login: profile.username },
      create: {
        avatar: {
          minio: false,
          path: avatarPath, // ? INFO :maybe we can't rename it to link !
        },
        login: profile.username,
        displayname: profile.displayName,
        email: profile.emails[0].value,
        stat: {
          create: {
            vectories: 0,
            defeats: 0,
            points: 0,
            rank: 'UNRANKED',
          },
        },
      },
      update: {},
    })) as UserWithAvatar;

    if (avatarPath && !user.avatar.minio && user.avatar.path !== avatarPath)
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          avatar: {
            minio: false,
            path: avatarPath,
          },
        },
      });
    return user;
  }
}
