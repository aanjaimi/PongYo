import { RedisService } from '@/redis/redis.service';
import { Injectable } from '@nestjs/common';

export enum QueueType {
  RANKED = 0x1,
  NORMAL = 0x2,
}

@Injectable()
export class QueueService {
  constructor(private redisService: RedisService) {}

  private getQueueTypeAsString(queueType: QueueType) {
    return queueType & QueueType.RANKED ? 'ranked' : 'normal';
  }

  async push(queueType: QueueType, payload: unknown) {
    await this.redisService.lpush(
      `queue:${this.getQueueTypeAsString(queueType)}`,
      JSON.stringify(payload),
    );
  }

  async pop(queueType: QueueType) {
    return await this.redisService.rpop(
      `queue:${this.getQueueTypeAsString(queueType)}`,
    );
  }
  // remove from queue
  async remove(queueType: QueueType, payload: unknown) {
    await this.redisService.lrem(
      `queue:${this.getQueueTypeAsString(queueType)}`,
      0,
      JSON.stringify(payload),
    );
  }
  async getLength(queueType: QueueType) {
    return await this.redisService.llen(
      `queue:${this.getQueueTypeAsString(queueType)}`,
    );
  }
  // check if user is in queue
  async isUserInQueue(queueType: QueueType, payload: unknown) {
    const queue = await this.redisService.lrange(
      `queue:${this.getQueueTypeAsString(queueType)}`,
      0,
      -1,
    );
    return queue.includes(JSON.stringify(payload));
  }
}