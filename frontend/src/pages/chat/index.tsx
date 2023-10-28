import type { User } from '@/types/user';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Chat from '@/components/chat/Chat';
import { useSocket } from '@/contexts/socket-context';
import { env } from '@/env.mjs';
import { ToastContainer } from 'react-toastify';

export default function Home() {
  const { chatSocket } = useSocket();
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [user, setUser] = useState<User | null>(null);

  const userQuery = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const { data }: { data: User } = await axios.get(uri + '/chat/me', {
        withCredentials: true,
      });
      data.channels.forEach((channel) => {
        const name: string[] = channel.name.split('-');
        channel.name = (name[0] === data.displayname
          ? name[1]
          : name[0]) as unknown as string;
      });
      setUser(data);
      return data;
    },
    // onError: (err) => {
    //   router.push('/').catch((err) => console.log(err));
    //   console.log(err);
    // },
  });

  useEffect(() => {
    const joinAllChannels = () => {
      user?.channels.forEach((channel) => {
        if (!channel.isDM)
          chatSocket.emit('join-channel', { channelId: channel.id });
        channel.msgNotification = false;
      });
    };

    const leaveAllChannels = () => {
      user?.channels.forEach((channel) => {
        if (!channel.isDM)
          chatSocket.emit('leave-channel', { channelId: channel.id });
      });
    };
    if (user) {
      joinAllChannels();
    }

    return () => {
      if (user) {
        leaveAllChannels();
      }
    };
  }, [user, chatSocket]);

  if (userQuery.isLoading) {
    return <div className="h-screen w-screen">Loading...</div>;
  }

  if (userQuery.isError) {
    return <div className="h-screen w-screen">Error</div>;
  }

  if (!user) {
    // router.push('/').catch((err) => console.log(err));
    return <div className="h-screen w-screen">Redirecting...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header component */}
      {/* <div className="h-[4rem] w-full bg-[#000000]"></div> */}
      <div className="flex grow flex-row">
        {/* Sidebar component */}
        {/* <div className="w-[4rem] bg-[#252525]"></div> */}
        <div className="ml-[3rem] mt-[3rem] flex grow justify-center">
          <Chat user={user} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
