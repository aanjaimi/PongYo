"use client";

import { env } from "@/env.mjs";
import { createContext, useContext, useEffect, useState } from "react";
import io, {
  type ManagerOptions,
  type SocketOptions,
  type Socket,
} from "socket.io-client";

type NullableObject<T> = {
  [K in keyof T]: T[K] | null;
};

type SocketContextProps = {
  socket: Socket;
  chatSocket: Socket;
  gameSocket: Socket;
};
const SocketContext = createContext<NullableObject<SocketContextProps>>({
  socket: null,
  chatSocket: null,
  gameSocket: null,
});

const useSocket = () => {
  const context = useContext(SocketContext);

  if (context) return context as unknown as SocketContextProps;

  throw new Error(`useSocket must be used within a SocketContextProvider`);
};

type SocketProviderProps = { children: React.ReactNode };
const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [gameSocket, setGameSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
    const opts = {
      withCredentials: true,
      transports: ["websocket"],
    } satisfies Partial<ManagerOptions & SocketOptions>;

    const [socket, chatSocket, gameSocket] = [
      io(uri, opts),
      io(uri + "/chat", opts), // ! TODO:  avoid double slash in path!
      io(uri + "/game", opts),
    ];
    setSocket(socket);
    setChatSocket(chatSocket);
    setGameSocket(gameSocket);
    return () => {
      socket.disconnect();
      chatSocket.disconnect();
      gameSocket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, chatSocket, gameSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
export { SocketProvider, useSocket };
