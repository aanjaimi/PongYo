import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ChatService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUser(userName: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { login: userName },
        include: { channels: { include: { messages: true } } },
      });
      if (!user) throw new Error('User not found');
      return user;
    } catch (err) {
      throw err;
    }
  }
}
