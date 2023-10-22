// src/players/players.module.ts

import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameStarterService } from './services/gameStarter.service';
import { InviteService } from './services/getFriend.service';
import { UserService } from './services/getFriend.service';
import { QueueService } from './services/redis.service';
import { AchievementService } from './services/achievements.service';
import { GameQueueService } from './services/GameQueue.service';

@Module({
  controllers: [],
  providers: [GameGateway, GameStarterService, InviteService,UserService,QueueService,AchievementService,GameQueueService],
})
export class GameModule {}
