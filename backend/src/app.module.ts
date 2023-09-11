import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema, validationOptions } from '@/config/validation.joi';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions,
    }),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
