import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import * as json from 'json';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly configService: ConfigService) {
    super({
      clientID: 'u-s4t2ud-40d52cceeb04a7346bea2177a11bcc4f3350f8316e6d3861514a7e83e450e31b', //configService.get('INTRA_CLIENT_ID'),
      clientSecret: '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', //configService.get('INTRA_CLIENT_SECRET'),
      callbackURL: 'http://localhost:5000/oauth/callback', //configService.get('INTRA_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
      return ({
        id: profile.id,
        login: profile.username,
        displayname: profile.name.givenName + " " + profile.name.familyName,
        email: profile.emails[0].value,
        userStatus: 'OFFLINE',
        createdAt: new Date(),
        updatedAt: new Date()
    });
  }
}