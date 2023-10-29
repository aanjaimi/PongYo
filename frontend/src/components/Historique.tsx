import React from 'react';
import Image from 'next/image';
import { fetcher } from '@/utils/fetcher';
import type { User } from '@/types/user';
import type { Game } from '@/types/game';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/pages/Loading';
import { useRouter } from 'next/router';

const getGames = async (id: string) => {
  return (await fetcher.get<Game[]>(`/games/${id}`)).data;
};

type HistoryProps = {
  user: User;
};

const Historique = ({ user }: HistoryProps) => {
  const router = useRouter();
  const gameHistoryQuery = useQuery({
    queryKey: ['games', user.id],
    queryFn: async ({ queryKey: [, id] }) => await getGames(id!),
    onError: (error) => {
      console.log(error);
    },
  });

  if (gameHistoryQuery.isLoading) return <Loading />;

  if (gameHistoryQuery.isError) void router.push('/404');

	return (
		<div style={{overflow: 'auto', maxHeight: '359px' }} className="grow mt-[10px]">
			<h1 className="my-[10px] flex items-center justify-center font-bold">Match histories</h1>
			{gameHistoryQuery.data?.map((game) => (
				<div key={game.id} className="flex justify-center mb-[20px]">
					<HoverCard>
						<HoverCardTrigger className="container bg-[#2B3954] border rounded-[15px] relative flex justify-between items-center w-[70%] md:w-[60%] lg:w-[50%] h-[70px]">
							{game.userStatus ? <div className="Winner">Winner</div> : <div className="Loser">Loser</div>}
							<div className="h-[100%] text-white font-bold flex items-center justify-center"><Image className="" alt="" src="/avatar.png" width={50} height={50}/></div>
							<div className="h-[100%] text-white font-bold flex items-center justify-center">vs</div>
							<div className="h-[100%] text-white font-bold flex items-center justify-center"><Image className="" alt="" src="/avatar.png" width={50} height={50}/></div>
							{game.opponentStatus ? <div className="Winner">Winner</div> : <div className="Loser">Loser</div>}
						</HoverCardTrigger>
						<HoverCardContent className="flex-col justify-around items-center">
							<div className="flex justify-around items-center">
								<div>
									<Image alt="" src={game.user.avatar.path} width={50} height={50} className=""/>
								</div>
								<div className="font-semibold">{game.userScore}</div>
								<div className="text-black font-semibold">-</div>
								<div className="font-semibold">{game.oppnentScore}</div>
								<div>
									<Image alt="" src={game.opponent.avatar.path} width={50} height={50} className=""/>
								</div>
							</div>
							<div className="flex justify-around items-center">
								<p className="text-black font-bold mt-[5px]">{game.user.login}</p>
								<div></div>
								<div></div>
								<div></div>
								<p className="text-black font-bold mt-[5px]">{game.opponent.login}</p>
							</div>
						</HoverCardContent>
					</HoverCard>
				</div>
			))}
		</div>
	)
}

export default Historique;
