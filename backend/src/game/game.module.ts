// src/players/players.module.ts

import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameStarterService } from './services/gameStarter.service';
import { InviteService } from './services/updateStatus.service';
import { UserService } from './services/updateStatus.service';
import { QueueService } from './services/redis.service';
import { AchievementService } from './services/achievements.service';
import { MatchMakerService } from './services/game.service';

@Module({
  exports: [GameGateway],
  controllers: [],
  providers: [
    GameGateway,
    GameStarterService,
    InviteService,
    UserService,
    QueueService,
    AchievementService,
    MatchMakerService,
  ],
})
export class GameModule {}
