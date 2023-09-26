import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ id }, { login: id }],
      },
    });
    if (!user) throw new NotFoundException();
    return user;
  }
}
