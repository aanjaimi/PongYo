import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { INestApplication } from '@nestjs/common';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    appOrHttpServer: INestApplication | any,
    private corsOptions: CorsOptions,
  ) {
    super(appOrHttpServer);
  }
  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: this.corsOptions,
    } satisfies ServerOptions) as Server;
    return server;
  }
}
