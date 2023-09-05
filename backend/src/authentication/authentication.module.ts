import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FortyTwoStrategy } from './fortytwo.strategy';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: "EXAMPLE", //TODO: get it from the config file
    signOptions: { expiresIn: '1d' },
  }),
  ],
  controllers: [AuthenticationController],
  providers: [FortyTwoStrategy, AuthenticationService]
})
export class AuthenticationModule {}
