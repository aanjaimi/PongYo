import react, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '@/types/User';
import axios from 'axios';
import Chat from '@/components/chat/Chat';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/router';
import { ReactDOM } from 'react';
import Cookie from 'js-cookie';
import { fetcher } from '@/utils/fetcher';
import { io } from 'socket.io-client';


export default function Home() {
	const [user, setUser] = useState<User | null>(null);
	// const ws = io("http://localhost:5010/chat", { autoConnect: false });

	useQuery({
		queryKey: ["userData"],
		queryFn: async () => {
			const { data } : { data : User } = await axios.get("http://localhost:5010/chat/me", { withCredentials: true });
			// ws.connect();;
			// console.log(data);
			data.channels.forEach(channel => {
				const name: string[] = channel.name.split('-');
				channel.name = (name[0] === data.displayName ? name[1] : name[0]) as unknown as string;
			});
			setUser(data);
			return data;
		}
	})

	if (!user)
		return (
			<>
			</>
		)

  return (
    <div className="flex flex-col min-h-screen">
			{/* Header component */}
			<div className="w-full h-[4rem] bg-[#000000]"></div>
			<div className="flex flex-row grow">
				{/* Sidebar component */}
				<div className="w-[4rem] bg-[#252525]"></div>
				<div className="grow flex justify-center mt-[3rem]">
					<Chat user={user} />
				</div>
			</div>
    </div>
  );
}
