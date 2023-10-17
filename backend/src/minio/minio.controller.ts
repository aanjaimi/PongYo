import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentUser } from '@/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('minio')
@UseGuards(JwtAuthGuard)
export class MinioController {
  // TODO: move it to users controller
  constructor(
    private minioService: MinioService,
    private prismaSerivce: PrismaService,
  ) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)/,
        })
        .addMaxSizeValidator({
          maxSize: 10000000, // 10m
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    avatar: Express.Multer.File,
    @CurrentUser() currUser: User,
  ) {
    const { login } = currUser;
    await this.prismaSerivce.user.update({
      where: { login },
      data: {
        avatar: {
          minio: true,
          path: avatar.path,
        },
      },
    });
    return { upload: 'success', path: avatar.path };
  }
}
