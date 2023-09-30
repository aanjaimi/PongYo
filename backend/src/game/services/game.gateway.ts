import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import { Injectable } from "@nestjs/common";
import { Server, Namespace, Socket } from "socket.io";
import { Engine, World, Bodies, Body, Runner } from "matter-js";
import { GameStarterService } from "./gameStarter.service";
import { map } from "rxjs/operators";

@Injectable()
@WebSocketGateway({
  cors: {
   origin: '*',
  }
})

export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(private gameStarterService :GameStarterService ) { }
  private gameSessions: Namespace[] = [];
  private playerQueue: Socket[] = [];


  handleConnection(client: Socket ) {
    console.log('Client connected');
  }
  @SubscribeMessage('joinQueue')
  hadleJoinQueue(client: Socket) {
    console.log('Client joined queue');
    this.playerQueue.push(client);
    if (this.playerQueue.length >= 2) {
      const player1 = this.playerQueue.shift();
      const player2 = this.playerQueue.shift();
      const roomName = `room-${Math.random()}`;
      this.gameStarterService.startGame(roomName, player1, player2);
      console.log('Game started');
      player1.emit('gameStart', { roomName});
      player2.emit('gameStart', { roomName});
      player1.emit('updateOpponentPosition', { x: 325, y: 735 });
      player1.emit('updatePlayerPosition', { x: 325, y: 15 });
      player2.emit('updatePlayerPosition', { x: 325, y: 735 });
      player2.emit('updateOpponentPosition', { x: 325, y: 15 });
      this.gameStarterService.startGame(roomName, player1, player2);
    }
  }
  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(client: Socket) {
    console.log('Client left queue');
    const index = this.playerQueue.indexOf(client);
    if (index !== -1) {
      this.playerQueue.splice(index, 1);
    }
  }
}
