import { StorageEngine } from 'multer';
import { MinioService } from './minio.service';
import { Request } from 'express';

export class MinioStorage implements StorageEngine {
  constructor(private minioService: MinioService) {}

  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ) {
    try {
      const { login } = req.user;
      const info = await this.minioService.uploadFile(login, file);
      callback(null, info);
    } catch (error) {
      callback(error, undefined);
    }
  }

  async _removeFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error) => void,
  ) {
    try {
      const { login } = req.user;
      await this.minioService.removeFile(login, file);
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}
