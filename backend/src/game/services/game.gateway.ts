import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import { Injectable } from "@nestjs/common";
import { Server, Namespace, Socket } from "socket.io";
import { Engine, World, Bodies, Body, Runner } from "matter-js";
import { GameStarterService } from "./gameStarter.service";
import { map } from "rxjs/operators";
import { GameMaker } from "./gameMaker.service";
import  QueueItem  from "../interfaces/Queue.interface";

@Injectable()
@WebSocketGateway({
  cors: {
   origin: '*',
  }
})
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor (private gameMaker : GameMaker ) {}
  private classicQueue: QueueItem[] = [];
  private rankedQueue: QueueItem[] = [];
  handleConnection(client: Socket ) {
  }
  @SubscribeMessage('joinQueue')
  hadleJoinQueue(client: Socket, user : any) {
    this.gameMaker.addPlayerToQueue(this.classicQueue, {client, user});
  }
  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(client: Socket, user : any) {
    this.gameMaker.removePlayerFromQueue(this.classicQueue, {client, user});
  }
  @SubscribeMessage('joinRankedQueue')
  handlejoinRankedQueue(client: Socket, user : any) {
    this.gameMaker.addPlayerToQueue(this.rankedQueue, {client, user});
  }
  @SubscribeMessage('leaveRankedQueue')
  handleLeaveRankedQueue(client: Socket, user : any) {
    this.gameMaker.removePlayerFromQueue(this.rankedQueue, {client, user});
  }
}
