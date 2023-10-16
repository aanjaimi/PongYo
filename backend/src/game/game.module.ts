// src/players/players.module.ts

import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameStarterService } from './services/gameStarter.service';
import { GameMaker } from './services/gameMaker.service';
import { InviteService } from './services/getFriend.service';
import { UserService } from './services/getFriend.service';

@Module({
  controllers: [],
  providers: [GameGateway, GameStarterService, GameMaker, InviteService,UserService],
})
export class GameModule {}
