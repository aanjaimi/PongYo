import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // TODO: add prisma logs option !
  async onModuleInit() {
    await this.$connect();
  }

  // TODO: disconnect the prisma connection !
}
