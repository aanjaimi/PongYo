import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types/User';
import axios from 'axios';
import Chat from '@/components/chat/Chat';
import { useSocket } from '@/contexts/socket-context';
import { env } from '@/env.mjs';
import { ToastContainer } from 'react-toastify';

export default function Home() {
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [user, setUser] = useState<User | null>(null);

  useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const { data }: { data: User } = await axios.get(uri + '/chat/me', {
        withCredentials: true,
      });
      data.channels.forEach((channel) => {
        const name: string[] = channel.name.split('-');
        channel.name = (name[0] === data.displayName
          ? name[1]
          : name[0]) as unknown as string;
      });
      setUser(data);
      return data;
    },
  });

  if (!user) return <></>;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header component */}
      <div className="h-[4rem] w-full bg-[#000000]"></div>
      <div className="flex grow flex-row">
        {/* Sidebar component */}
        <div className="w-[4rem] bg-[#252525]"></div>
        <div className="mt-[3rem] flex grow justify-center">
          <Chat user={user} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
