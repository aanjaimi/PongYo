import { Socket } from 'socket.io';
interface QueueItem {
  client: Socket;
  user: any; // Replace 'any' with the actual type of your user object
}
export default QueueItem;
