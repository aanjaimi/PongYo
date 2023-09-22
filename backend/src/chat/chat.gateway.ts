import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io"

@WebSocketGateway({})
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('onMessage')
	onNewMessage(@MessageBody() body: any) {
		console.log(body);
		this.server.emit('onMessage', {
			msg: 'new message',
			content: body,
		});
		return undefined;
	}
}