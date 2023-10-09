import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, MessageBody } from "@nestjs/websockets";
import { Injectable } from "@nestjs/common";
import { Server, Namespace, Socket } from "socket.io";
import { Engine, World, Bodies, Body, Runner } from "matter-js";
import { GameStarterService } from "./gameStarter.service";
import { map } from "rxjs/operators";
import { GameMaker } from "./gameMaker.service";
import QueueItem from "../interfaces/Queue.interface";
import Player from "../interfaces/Player.interface"
import { ConnectedSocket } from "@nestjs/websockets";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { User } from '@prisma/client';
import { CurrentUser } from '@/auth/auth.decorator';


@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(private gameMaker: GameMaker) { }

  private classicQueue: QueueItem[] = [];
  private rankedQueue: QueueItem[] = [];
  private users: Map<string, Socket> = new Map();
  // @UseGuards(JwtAuthGuard)
  handleConnection(client: Socket,  @CurrentUser() user: User) {
  //  console.log(user)
    // console.log(client);
  }
  @SubscribeMessage('joinQueue')
  @UseGuards(JwtAuthGuard)
  hadleJoinQueue(@MessageBody("user") user: Player, @ConnectedSocket() client: Socket,  @CurrentUser() user1: User) {
    console.log(user1);
    // this.gameMaker.addPlayerToQueue(this.classicQueue, { client, user });

  }
  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(@MessageBody("user") user: Player, @ConnectedSocket() client: Socket) {
    this.classicQueue = this.classicQueue.filter((item) => item.client.id !== client.id);
  }
  @SubscribeMessage('joinRankedQueue')
  handlejoinRankedQueue(@MessageBody("user") user: Player, @ConnectedSocket() client: Socket) {
    this.gameMaker.addPlayerToQueue(this.rankedQueue, { client, user });
  }
  @SubscribeMessage('leaveRankedQueue')
  handleLeaveRankedQueue(@MessageBody("user") user: Player, @ConnectedSocket() client: Socket) {
    this.rankedQueue = this.rankedQueue.filter((item) => item.client.id !== client.id);
  }

  @SubscribeMessage('invireToGame')
  handleInviteToGame(@MessageBody("user") user: Player, @MessageBody("friend") friend: string, @ConnectedSocket() client: Socket) {
    // let friendSocket = this.users.get(friend);
    // console.log("trying to invite")
    // console.log(friend)
    // if (friendSocket) {
    //   console.log("inviting")
    //   // friendSocket.emit("inviting", user);
    //   client.to(friendSocket.id).emit("inviting", user);
    // }
     // 
  }

  @SubscribeMessage('acceptInvite')
  handleAcceptInvite(@MessageBody("user") user: Player, @ConnectedSocket() client: Socket, @MessageBody("friend") friend: string) {
    console.log("accepting invite")
    // const friendSocket = this.users.get(friend);
    // this.gameMaker.addPlayerToQueue(this.classicQueue, {client, user});
    // this.gameMaker.addPlayerToQueue(this.classicQueue, {client: friendSocket, user});
  }
}
