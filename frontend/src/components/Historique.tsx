import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { fetcher } from '@/utils/fetcher';
import type { User } from '@/types/user';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const getOpponent = async (id: string) => {
  const userOpponent = await fetcher.get<User | null>("/users/" + id);
  return userOpponent.data;
};

type HistoryProps = {
	user: User;
};

const Historique = ({ user }: HistoryProps) => {

	const [opponents, setOpponents] = useState<Array<User | null>>([]);

  useEffect(() => {
    const fetchOpponents = async () => {
			try {
      	const opponentPromises = user?.userGameHistory?.map((gam) => getOpponent(gam.opponentId)) || [];
      	const resolvedOpponents = await Promise.all(opponentPromises);
      	setOpponents(resolvedOpponents);
			} catch (error) {
				console.error(error);
			}
    };

    void fetchOpponents();
  }, [user?.userGameHistory]);

	return (
		<div style={{overflow: 'auto', maxHeight: '359px' }} className="grow mt-[10px]">
			<h1 className="my-[10px] flex items-center justify-center font-bold">Match histories</h1>
			{user?.userGameHistory?.map((gam, index) => (
				<div key={gam.id} className="flex justify-center mb-[20px]">
					<HoverCard>
						<HoverCardTrigger className="container bg-[#2B3954] border rounded-[15px] relative flex justify-between items-center w-[70%] md:w-[60%] lg:w-[50%] h-[70px]">
							{gam.userStatus ? <div className="Winner">Winner</div> : <div className="Loser">Loser</div>}
							<div className="h-[100%] text-white font-bold flex items-center justify-center"><Image className="" alt="" src="/avatar.png" width={50} height={50}/></div>
							<div className="h-[100%] text-white font-bold flex items-center justify-center">vs</div>
							<div className="h-[100%] text-white font-bold flex items-center justify-center"><Image className="" alt="" src="/avatar.png" width={50} height={50}/></div>
							{gam.opponentStatus ? <div className="Winner">Winner</div> : <div className="Loser">Loser</div>}
						</HoverCardTrigger>
						<HoverCardContent className="flex-col justify-around items-center">
							<div className="flex justify-around items-center">
								<div>
									<Image alt="" src="/avatar.png" width={50} height={50} className=""/>
								</div>
								<div className="font-semibold">{gam.userScore}</div>
								<div className="text-black font-semibold">-</div>
								<div className="font-semibold">{gam.oppnentScore}</div>
								<div>
									<Image alt="" src="/avatar.png" width={50} height={50} className=""/>
								</div>
							</div>
							<div className="flex justify-around items-center">
								<p className="text-black font-bold mt-[5px]">{user?.login}</p>
								<div></div>
								<div></div>
								<div></div>
								<p className="text-black font-bold mt-[5px]">{opponents[index]?.login}</p>
							</div>
						</HoverCardContent>
					</HoverCard>
				</div>
			))}
		</div>
	)
}

export default Historique;
