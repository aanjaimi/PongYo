import react, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '@/types/User';
import axios from 'axios';
import Chat from '@/components/chat/Chat';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/router';


export default function Home() {
	const [user, setUser] = useState<User | null>(null);

	useQuery({
		// queryKey: ["userData"],
		queryFn: async () => {
			const { data } = await axios.get("http://localhost:5000/chat/me?userName=1")
			setUser(data as User)
			return data as User
		}
	})

	if (!user)
		return <></>

  return (
    <div className="flex flex-col border w-screen h-screen">
			<div className="w-full h-[5rem] bg-[#000000]"></div>
			<div className="flex flex-row grow">
				<div className="h-full w-[5rem] bg-[#252525]"></div>
				<div className="grow flex justify-center mt-[5rem]">
					<Chat user={user} />
				</div>
			</div>
    </div>
  );
}
