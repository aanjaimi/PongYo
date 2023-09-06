import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema, validationOptions } from '@/config/validation.joi';
import { AuthModule } from './auth/auth.module';
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
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
