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
      info._minioService = this.minioService;
      info.deleteObject = async function () {
        return await this._minioService.removeFile(login, this);
      };
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
      await file.deleteObject();
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}
