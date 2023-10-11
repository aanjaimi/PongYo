import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, MessageBody, OnGatewayDisconnect } from "@nestjs/websockets";
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
import { WsGateway } from "@/ws/ws.gateway";
import { PrismaService } from "@/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "@/redis/redis.service";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { InviteService } from "@/game/services/getFriend.service";
import { GuardsConsumer } from "@nestjs/core/guards";


@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
     },
  namespace: 'game'
})
export class GameGateway extends WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private gameMaker: GameMaker,
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
    protected configService: ConfigService,
    protected redisService: RedisService,
    private inviteService : InviteService,
    )
    {
      super(prismaService, jwtService, configService, redisService);
    }

  private classicQueue: QueueItem[] = [];
  private rankedQueue: QueueItem[] = [];
  private users: Map<string, Socket> = new Map();

  handleConnection(client: Socket){
    console.log('connected to ws gateway');
    return super.handleConnection(client).then(() => {
      this.users.set(client.user.id, client);
      console.log(client.user);
    }
    );
  }

  @SubscribeMessage('joinQueue')
  // @UseGuards(JwtAuthGuard)
  hadleJoinQueue(client: Socket, body: any) {
    console.log("joining");
    this.gameMaker.addPlayerToQueue(this.classicQueue, { client, user: client.user});
  }
  @SubscribeMessage('leaveQueue')
  // @UseGuards(JwtAuthGuard)
  handleLeaveQueue(client: Socket) {
    console.log("leaving");
    this.classicQueue = this.classicQueue.filter((item) => item.client.id !== client.id);
  }
  @SubscribeMessage('joinRankedQueue')
  // @UseGuards(JwtAuthGuard)
  hadleJoinRankedQueue(client: Socket, body: any) {
    console.log("joining ranked");
    this.gameMaker.addPlayerToQueue(this.rankedQueue, { client, user: client.user});
  }
  @SubscribeMessage('leaveRankedQueue')
  // @UseGuards(JwtAuthGuard)
  handleLeaveRankedQueue(client: Socket) {
    console.log("leaving ranked");
    this.rankedQueue = this.rankedQueue.filter((item) => item.client.id !== client.id);
  }
  @SubscribeMessage('invite')
  handleInvite(client: Socket, payload: { username: string }) {
    const { username } = payload; // ?INFO: the username of the user to be invited.
    console.log(username);
    console.log(client.user);
    this.inviteService.handleInvite(client.user.id, username).then((res) => {
      if(res){
        if(this.users.get(res)){
          console.log(res);
          client.emit('invitedSuccess', {msg:`"${username}" invited successfully`});
          // emite to the invited user
          this.users.get(res).emit('invited', {msg:`"${client.user.login}" invited you to a game`, friend: client.user.id});
        }
        else{
          client.emit('invitedFail', {msg:`"${username}" is not online`});
        }
      }
      else{
        client.emit('invitedFail', {msg:`"${username}" is not your friend`, friend: client.user.id});
      }
    }
    );
  }
  @SubscribeMessage('acceptInvite')
  handleAcceptInvite(client: Socket, payload: { friend: string }) {
    
    const { friend } = payload; // ?INFO: the username of the user to be invited.
    const friendSocket = this.users.get(friend);
    if(friendSocket){
      friendSocket.emit('acceptedInvite', {msg:`"${client.user.login}" accepted your invite`, friend: client.user.id});
      this.gameMaker.addPlayerToQueue(this.classicQueue, { client: friendSocket, user: friendSocket.user});
      this.gameMaker.addPlayerToQueue(this.classicQueue, { client, user: client.user});
    }
  }
 
}
