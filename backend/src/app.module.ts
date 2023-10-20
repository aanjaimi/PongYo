import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema, validationOptions } from '@/config/validation.joi';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { GameModule } from './game/game.module';
import { WsModule } from './ws/ws.module';
import { MinioModule } from './minio/minio.module';
import { FriendModule } from './friends/friends.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
    UserModule,
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
    GameModule,
    WsModule,
    EventEmitterModule.forRoot({ global: true }),
    MinioModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          endPoint: configService.get('MINIO_ENDPOINT'),
          port: 9000,
          useSSL: false,
          accessKey: configService.get('MINIO_ACCESS_KEY'),
          secretKey: configService.get('MINIO_SECRET_KEY'),
        };
      },
    }),
    FriendModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
