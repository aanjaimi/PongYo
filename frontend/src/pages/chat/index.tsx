import react, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '@/types/User';
import axios from 'axios';


export default function Home() {
	// const queryClient = useQueryClient();
	// const [user, setUser] = useState<User | null>(null);

	// const userQuery = useQuery({
	// 	queryKey: ["userData"],
	// 	queryFn: async () => {
	// 		axios.get("localhost:3000/me")
	// 		.then()
	// 	}
	// })

  return (
    <div className="flex flex-col border w-screen h-screen">
			<div className="w-full h-[5rem] bg-[#000000]"></div>
			<div className="flex flex-row grow">
				<div className="h-full w-[5rem] bg-[#252525]"></div>
				
			</div>
    </div>
  );
}
