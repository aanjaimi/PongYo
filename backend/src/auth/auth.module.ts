import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { FortyTwoStrategy } from './strategies/42.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { OtpStrategy } from './strategies/totp.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    PassportModule.register({
      session: false,
    }),
  ],
  controllers: [AuthController],
  providers: [OtpStrategy, FortyTwoStrategy, JwtStrategy, AuthService],
})
export class AuthModule {}
