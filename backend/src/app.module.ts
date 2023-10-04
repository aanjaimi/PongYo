import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema, validationOptions } from '@/config/validation.joi';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from './redis/redis.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions,
    }),
    ChatModule,
    AuthModule,
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
          password: configService.getOrThrow('REDIS_PASSWORD'),
        };
      },
    }),
    WsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
