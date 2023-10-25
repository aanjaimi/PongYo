import { Inject, Injectable } from '@nestjs/common';

import { Redis } from 'ioredis';
import { MODULE_OPTIONS_TOKEN } from './redis.module-definition';
import { RedisModuleOptions } from './redis.inreface';

@Injectable()
export class RedisService extends Redis {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private redisOptions: RedisModuleOptions,
  ) {
    super(redisOptions);
  }

  async getUserSockets(userId: string) {
    return Object.keys((await this.hgetall(userId)) || {});
  }
}
