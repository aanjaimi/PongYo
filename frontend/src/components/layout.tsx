import React, { useEffect } from 'react';
import NavBar from './navbar/NavBar';
import SideBar from './sidebar/SideBar';
import { useStateContext } from '@/contexts/state-context';
import Otp from './Otp';
import { useSocket } from '@/contexts/socket-context';
import { toast } from 'react-toastify';
import router from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const {
    state: { auth_status },
  } = useStateContext();

  const { notifSocket, chatSocket, gameSocket } = useSocket();

  useEffect(() => {
    const inviteNotify = (data: { msg: string; friend: string }) => {
      toast(data.msg, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        onClick: () => {
          gameSocket.emit('acceptInvite', { opponent: data.friend });
          router
            .push({
              pathname: '/game',
              query: {
                username: data.friend,
                startGame: true,
              },
            })
            .catch((err) => console.log(err));
        },
      });
    };
    if (auth_status === 'authenticated') {
      if (!notifSocket.connected) notifSocket.connect();
      if (!chatSocket.connected) chatSocket.connect();
      if (!gameSocket.connected) gameSocket.connect();
      gameSocket.on('invited', (data: { msg: string; friend: string }) => {
        inviteNotify({ msg: data.msg, friend: data.friend });
      });
      return () => {
        gameSocket.off('invited', inviteNotify);
      };
    }
  }, [auth_status, notifSocket, chatSocket, gameSocket]);

  if (auth_status === 'otp')
    return (
      <div className="flex h-screen w-screen">
        <Otp />
      </div>
    );

  if (auth_status === 'authenticated') {
    return (
      <div className="flex h-screen w-screen flex-col">
        <NavBar />
        <div className="flex h-full w-full">
          <SideBar />
          <div className="h-full w-full">{children}</div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return <div className="flex h-screen w-screen">{children}</div>;
}
