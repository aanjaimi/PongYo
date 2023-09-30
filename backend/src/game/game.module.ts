// src/players/players.module.ts

import { Module } from '@nestjs/common';
import { GameGateway } from './services/game.gateway';
import { GameStarterService } from './services/gameStarter.service';

@Module({
  controllers: [],
  providers: [GameGateway, GameStarterService],
})
export class GameModule {}