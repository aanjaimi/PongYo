import { User } from '@prisma/client';

declare module 'socket.io' {
  interface Socket {
    user: User | null;
  }
}
