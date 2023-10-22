import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ id }, { login: id }],
      },
      include: {
        achievement: true,
        userGameHistory: true,
      },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getUsersContainingValue(value: string): Promise<User[]> {
    if (!value || value === '') return [];
    const users = await this.prismaService.user.findMany({
      where: {
        login: {
          contains: value,
        },
      },
    });
    if (!users) return [];
    return users;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      orderBy: [
        {
          rank: 'desc',
        },
        {
          points: 'desc',
        },
      ],
    });
    if (!users) return [];
    return users;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    const { displayName, twoFactorAuth, isComplete } = updateUserDto;
    const tfa = twoFactorAuth === 'true' ? true : false;
    const complete = isComplete === 'true' ? true : false;
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        displayname: displayName,
        isCompleted: complete,
        twoFactorAuth: tfa,
      },
    });
  }
}
