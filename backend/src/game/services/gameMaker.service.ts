import { Injectable } from '@nestjs/common';
import { GameStarterService } from './gameStarter.service';
import QueueItem from '../interfaces/Queue.interface';
import { UserService } from './getFriend.service';

@Injectable()
export class GameMaker {
  constructor(private gameStarterService: GameStarterService, private userService: UserService) {}
  addPlayerToQueue(classicQueue: QueueItem[], client: QueueItem, isRanked: boolean) {
    console.log('User');
    console.log(client.user);
    if (classicQueue.some(item => item.user.login === client.user.login)) {
      client.client.emit('alreadyInQueue', {
        msg: 'You are already in queue'
      });
      return;
    }
    if(client.user.userStatus === 'IN_GAME') {
      client.client.emit('alreadyInQueue', {
        msg: 'You are already in game'
      });
      return;
    }
    console.log('Client joined queue');
    client.client.emit('queueJoined');
    classicQueue.push(client);
    if (classicQueue.length >= 2) {
      console.log('Game starting');
      const player1 = classicQueue.shift();
      const player2 = classicQueue.shift();
      // this.userService.updateUserStatus(player1.user.id, 'IN_GAME');
      // this.userService.updateUserStatus(player2.user.id, 'IN_GAME');
      console.log(player1.user);
      console.log(player2.user);
      player1.client.emit('gameStart',{
        oppData: player2.user
      });
      player2.client.emit('gameStart',{
        oppData: player1.user
      });
      this.gameStarterService.startGame(player1, player2, isRanked);
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
