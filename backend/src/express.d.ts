import { User } from '@prisma/client';
import { AUTH_COOKIE_NAME } from './auth/auth.constants';
import { MinioService } from './minio/minio.service';

declare module 'express' {
  interface Request {
    user?: User;
    cookies: Record<string, string> & {
      [AUTH_COOKIE_NAME]: string;
    };
  }
}
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        _minioService: MinioService;
        deleteObject: () => Promise<void>;
      }
    }
  }
}
