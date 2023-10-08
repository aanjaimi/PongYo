import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, MessageBody } from "@nestjs/websockets";
import { Injectable } from "@nestjs/common";
import { Server, Namespace, Socket } from "socket.io";
import { Engine, World, Bodies, Body, Runner } from "matter-js";
import { GameStarterService } from "./gameStarter.service";
import { map } from "rxjs/operators";
import { GameMaker } from "./gameMaker.service";
import  QueueItem  from "../interfaces/Queue.interface";
import Player from "../interfaces/Player.interface"
import { ConnectedSocket } from "@nestjs/websockets";

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
  hadleJoinQueue(@MessageBody("user") user: Player, @ConnectedSocket() client: Socket) {
    this.gameMaker.addPlayerToQueue(this.classicQueue, {client, user});
    console.log(user);
  }
  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(@MessageBody("user") user : Player, @ConnectedSocket() client: Socket) {
    this.classicQueue = this.classicQueue.filter((item) => item.client.id !== client.id);
  }
  @SubscribeMessage('joinRankedQueue')
  handlejoinRankedQueue(@MessageBody("user") user : Player, @ConnectedSocket() client: Socket) {
    this.gameMaker.addPlayerToQueue(this.rankedQueue, {client, user});
  }
  @SubscribeMessage('leaveRankedQueue')
  handleLeaveRankedQueue(@MessageBody("user") user : Player, @ConnectedSocket() client: Socket) {
    this.rankedQueue = this.rankedQueue.filter((item) => item.client.id !== client.id);
  }
}
