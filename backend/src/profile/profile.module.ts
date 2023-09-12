import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    global: true,
  }),],
  controllers: [ProfileController],
  providers: [ProfileService, JwtStrategy]
})
export class ProfileModule {}
