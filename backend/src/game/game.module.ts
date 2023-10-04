// src/players/players.module.ts

import { Module } from '@nestjs/common';
import { GameGateway } from './services/game.gateway';
import { GameStarterService } from './services/gameStarter.service';
import { GameMaker } from './services/gameMaker.service';

@Module({
  controllers: [],
  providers: [GameGateway, GameStarterService, GameMaker],
})
export class GameModule {}