import { Injectable } from "@nestjs/common";
import { Server, Namespace, Socket } from "socket.io";
import { GameStarterService } from "./gameStarter.service";
import QueueItem from "../interfaces/Queue.interface";

@Injectable()
export class GameMaker {
	
	constructor(private gameStarterService :GameStarterService) { }
	addPlayerToQueue (classicQueue: QueueItem[], client : QueueItem )
	{
		console.log('Client joined queue');
		classicQueue.push(client);
		if (classicQueue.length >= 2) {
			console.log('Game starting');
			const player1 = classicQueue.shift();
			const player2 = classicQueue.shift();
			// const roomName = `room-${Math.random()}`;
			// player1.client.emit('gameStart', { roomName});
			// player2.client.emit('gameStart', { roomName});
			// player1.client.emit('updateOpponentPosition', { x: 325, y: 735 });
			// player1.client.emit('updatePlayerPosition', { x: 325, y: 15 });
			// player2.client.emit('updatePlayerPosition', { x: 325, y: 735 });
			// player2.client.emit('updateOpponentPosition', { x: 325, y: 15 });
			// this.gameStarterService.startGame(roomName, player1, player2);
		}
	}
	removePlayerFromQueue (classicQueue: QueueItem[], client : QueueItem)
	{
		console.log('Client left queue');
		const index = classicQueue.indexOf(client);
		if (index !== -1) {
			classicQueue.splice(index, 1);
		}
	}


}