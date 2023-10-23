import {
  Controller,
  Get,
  UseGuards,
  Param,
  Query,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '@prisma/client';
import { CurrentUser } from '@/auth/auth.decorator';
import { UserQueryDTO, UserUpdateDTO } from './users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(@CurrentUser() user: User, @Query() query: UserQueryDTO) {
    return await this.userService.getUsers(user.id, query);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: User, @Param('id') login: string) {
    return await this.userService.getUser(user.id, login);
  }
  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @CurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(jpg|jpeg|png|gif)$/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    avatar: Express.Multer.File,
    @Body() body: UserUpdateDTO,
  ) {
    return await this.userService.updateUser(user, avatar, body);
  }
}
