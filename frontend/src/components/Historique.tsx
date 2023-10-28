import React, { useState, useEffect } from 'react';
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
  return (await fetcher.get<Game[] | []>(`/games/${id}`)).data;
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
    <div
      style={{ overflow: 'auto', maxHeight: '359px' }}
      className="mt-[10px] grow"
    >
      <h1 className="my-[10px] flex items-center justify-center font-bold">
        Match histories
      </h1>
      {gameHistoryQuery.data?.map((gam, index) => (
        <div key={gam.id} className="mb-[20px] flex justify-center">
          <HoverCard>
            <HoverCardTrigger className="container relative flex h-[70px] w-[70%] items-center justify-between rounded-[15px] border bg-[#2B3954] md:w-[60%] lg:w-[50%]">
              {gam.userStatus ? (
                <div className="Winner">Winner</div>
              ) : (
                <div className="Loser">Loser</div>
              )}
              <div className="flex h-[100%] items-center justify-center font-bold text-white">
                <Image
                  className=""
                  alt=""
                  src="/avatar.png"
                  width={50}
                  height={50}
                />
              </div>
              <div className="flex h-[100%] items-center justify-center font-bold text-white">
                vs
              </div>
              <div className="flex h-[100%] items-center justify-center font-bold text-white">
                <Image
                  className=""
                  alt=""
                  src="/avatar.png"
                  width={50}
                  height={50}
                />
              </div>
              {gam.opponentStatus ? (
                <div className="Winner">Winner</div>
              ) : (
                <div className="Loser">Loser</div>
              )}
            </HoverCardTrigger>
            <HoverCardContent className="flex-col items-center justify-around">
              <div className="flex items-center justify-around">
                <div>
                  <Image
                    alt=""
                    src="/avatar.png"
                    width={50}
                    height={50}
                    className=""
                  />
                </div>
                <div className="font-semibold">{gam.userScore}</div>
                <div className="font-semibold text-black">-</div>
                <div className="font-semibold">{gam.oppnentScore}</div>
                <div>
                  <Image
                    alt=""
                    src="/avatar.png"
                    width={50}
                    height={50}
                    className=""
                  />
                </div>
              </div>
              <div className="flex items-center justify-around">
                <p className="mt-[5px] font-bold text-black">{user?.login}</p>
                <div></div>
                <div></div>
                <div></div>
                {/* <p className="mt-[5px] font-bold text-black">
                  {opponents[index]?.login} //! FIX THIS
                </p> */}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      ))}
    </div>
  );
};

export default Historique;
