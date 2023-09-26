import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema, validationOptions } from '@/config/validation.joi';
<<<<<<< HEAD
import { ChatModule } from './chat/chat.module';
=======
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
>>>>>>> dev

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions,
    }),
<<<<<<< HEAD
    ChatModule,
=======
    AuthModule,
>>>>>>> dev
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
