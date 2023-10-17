import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigurableModuleClass } from './minio.module-definition';
import { MinioController } from './minio.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MinioStorage } from './minio.storage';

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
  providers: [MinioService],
  exports: [MinioService],
  controllers: [MinioController],
})
export class MinioModule extends ConfigurableModuleClass {}
