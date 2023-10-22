import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WsGateway } from '../ws.gateway';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway extends WsGateway {
  @SubscribeMessage('channelCreated')
  channelCreated(client: Socket) {
    // ?INFO: u'll find the currentUser in client.user
    // console.log(client.user);
  }
}
