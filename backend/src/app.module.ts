import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema, validationOptions } from '@/config/validation.joi';
import { AuthenticationModule } from './authentication/authentication.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions,
    }),
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
