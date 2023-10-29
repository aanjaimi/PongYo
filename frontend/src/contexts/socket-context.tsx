'use client';

import { env } from '@/env.mjs';
import { createContext, useContext, useEffect, useReducer } from 'react';
import io, {
  type ManagerOptions,
  type SocketOptions,
  type Socket,
} from 'socket.io-client';
import { useStateContext } from './state-context';

type SocketContextProps = {
  notifSocket: Socket;
  chatSocket: Socket;
  gameSocket: Socket;
};
const SocketContext = createContext<Partial<SocketContextProps>>({
  notifSocket: undefined,
  chatSocket: undefined,
  gameSocket: undefined,
});

const useSocket = () => {
  const context = useContext(SocketContext);

  if (context) return context as unknown as SocketContextProps;

  throw new Error(`useSocket must be used within a SocketContextProvider`);
};

type SocketProviderProps = { children: React.ReactNode };
const SocketProvider = ({ children }: SocketProviderProps) => {
  function reducer(state: SocketContextProps, _action: unknown) {
    return state;
  }

  const { state } = useStateContext();

  const [{ notifSocket, chatSocket, gameSocket }] = useReducer(
    reducer,
    undefined,
    () => {
      const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
      const opts = {
        withCredentials: true,
        transports: ['websocket'],
        autoConnect: state.auth_status === 'authenticated',
      } satisfies Partial<ManagerOptions & SocketOptions>;

      const [notifSocket, chatSocket, gameSocket] = [
        // TODO: pass opts from provider!
        io(uri + '/notification', opts),
        io(uri + '/chat', opts), // ! TODO:  avoid double slash in path!
        io(uri + '/game', opts),
      ];
      return {
        notifSocket,
        chatSocket,
        gameSocket,
      } satisfies SocketContextProps;
    },
  );

  useEffect(() => {
    return () => {
      notifSocket.disconnect();
      chatSocket.disconnect();
      gameSocket.disconnect();
    };
  }, [notifSocket, chatSocket, gameSocket]);
  return (
    <SocketContext.Provider value={{ notifSocket, chatSocket, gameSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
export { SocketProvider, useSocket };
