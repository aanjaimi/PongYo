// game-queue.service.ts

import { Injectable } from '@nestjs/common';
import { QueueService, QueueType } from './redis.service';

@Injectable()
export class GameQueueService {
  constructor(private queueService: QueueService) {}

  async joinQueue(userId: string, queueType: QueueType) {
    if (await this.queueService.isUserInQueue(queueType, userId)) {
      return false; // User is already in the classic queue
    }

    // Add the user to the classic queue
    await this.queueService.push(queueType, userId);
    return true;
  }

  async leaveQueue(userId: string, queueType: QueueType) {
    this.queueService.remove(queueType, userId);
  }

}
