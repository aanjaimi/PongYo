import { Injectable } from '@nestjs/common';
import { GameStarterService } from './gameStarter.service';
import QueueItem from '../interfaces/Queue.interface';

@Injectable()
export class GameMaker {
  constructor(private gameStarterService: GameStarterService) {}
  addPlayerToQueue(classicQueue: QueueItem[], client: QueueItem) {
    console.log('Client joined queue');
    classicQueue.push(client);
    if (classicQueue.length >= 2) {
      console.log('Game starting');
      const player1 = classicQueue.shift();
      const player2 = classicQueue.shift();
      console.log(player1.user);
      console.log(player2.user);
      player1.client.emit('gameStart', {
        user: player1.user,
        opp: player2.user,
      });
      player2.client.emit('gameStart', {
        user: player2.user,
        opp: player1.user,
      });

      this.gameStarterService.startGame(player1, player2);
    }
  }
  removePlayerFromQueue(classicQueue: QueueItem[], client: QueueItem) {
    console.log('Client left queue');
    const index = classicQueue.indexOf(client);
    if (index !== -1) {
      classicQueue.splice(index, 1);
    }
  }
}
