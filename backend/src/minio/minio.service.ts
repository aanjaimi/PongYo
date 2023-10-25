import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { MODULE_OPTIONS_TOKEN } from './minio.module-definition';
import { MinioModuleOptions } from './minio.interface';
import { randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class MinioService extends Client {
  bucketName: string;
  constructor(@Inject(MODULE_OPTIONS_TOKEN) minioOptions: MinioModuleOptions) {
    super(minioOptions);
    this.bucketName = 'avatars';
    this.createBucket().catch();
  }

  private async createBucket() {
    try {
      const bucketExists = await this.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.makeBucket(this.bucketName);
        await this.setBucketToPublic();
      }
    } catch (err) {
      console.error(err);
    }
  }
  private async setBucketToPublic() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };
    await this.setBucketPolicy(this.bucketName, JSON.stringify(policy));
  }

  private generateRandomFilename(originalname: string) {
    const ext = path.extname(originalname).toLowerCase();
    return `${randomUUID()}${ext}`;
  }

  async uploadFile(login: string, file: Express.Multer.File) {
    const filename = this.generateRandomFilename(file.originalname);
    const objectName = path.join(login, filename);

    const { versionId } = await this.putObject(
      this.bucketName,
      objectName,
      file.stream,
    );

    const [presingedUrl, stat] = await Promise.all([
      this.presignedGetObject(this.bucketName, objectName),
      this.statObject(this.bucketName, objectName, {
        versionId,
      }),
    ]);

    return {
      ...file,
      path: presingedUrl,
      size: stat.size,
      filename,
    } satisfies Partial<Express.Multer.File>;
  }

  async removeFile(login: string, file: Express.Multer.File) {
    const objectName = path.join(login, file.filename);
    await this.removeObject(this.bucketName, objectName);
  }
}
