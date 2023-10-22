import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { MinioService } from '@/minio/minio.service';
import { MinioStorage } from '@/minio/minio.storage';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [MinioService],
      useFactory(minioService: MinioService) {
        return {
          storage: new MinioStorage(minioService),
          limits: {
            files: 1, // allow only 1 file per request
            fileSize: 5 * (1024 * 1024), // 5 MB (max file size)
          },
        };
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
