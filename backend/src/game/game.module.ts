// src/players/players.module.ts

import { Module } from '@nestjs/common';
import { GameGateway } from './services/game.gateway';
import { GameStarterService } from './services/gameStarter.service';
import { GameMaker } from './services/gameMaker.service';
import { GameController } from './game.controller';
import { FriendsService } from './services/friends.service';

@Module({
  controllers: [GameController],
  providers: [GameGateway, GameStarterService, GameMaker , FriendsService],
})
export class GameModule {}