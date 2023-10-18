import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Achievement from './Achievement';
import History from './History';
import Rank from './LeaderBoard';
import { ALLbuttons } from '../types/common'
import type { Achievements } from '@/types/achievement';
import { useStateContext } from '@/contexts/state-context';

const UserInfo = () => {

  const { state } = useStateContext();

  const [achievement, setAchievement] = useState<Achievements[] | []>(state.achievement);
  // const [history, setHistory] = useState<Historique[] | []>([]);
  // const [rank, setRank] = useState<Game[] | []>([]);

  const [achievementBool, setAchievementBool] = useState<boolean>(true);
  const [historyBool, setHistoryBool] = useState<boolean>(false);
  const [rankBool, setRankBool] = useState<boolean>(false);

  const setAchievements = () => {
    setAchievementBool(true);
    setHistoryBool(false);
    setRankBool(false);
  }

  const setHistories = () => {
    setHistoryBool(true);
    setRankBool(false);
    setAchievementBool(false);
  }

  const setRanks = () => {
    setRankBool(true);
    setAchievementBool(false);
    setHistoryBool(false);
  }

  return (
    <div className="rounded-2xl flex flex-col w-[413px] md:w-[613px] lg:w-[968px] h-[419px] bg-[#33437D] mt-[36px] mb-[3rem]">
      <div className="border-b-[2px] w-[400px] md:w-[600px] lg:w-[955px] h-[60px] flex items-center justify-center ml-[6px] mr-[6px]">
        <div className="border-r-[2px] w-[322px] h-[51px] flex items-center justify-center">
          <Button variant="ghost" onClick={setAchievements}><Image src={achievementBool == true ? ALLbuttons.ACHIEVEMENT_ON : ALLbuttons.ACHIEVEMENT_OFF} alt="image" width={34} height={34}/></Button>
        </div>
        <div className="border-r-[2px] w-[322px] h-[51px] flex items-center justify-center">
          <Button variant="ghost" onClick={setHistories}><Image src={historyBool == true ? ALLbuttons.HISTORY_ON : ALLbuttons.HISTORY_OFF} alt="image" width={30} height={30}/></Button>
        </div>
        <div className="w-[322px] h-[51px] flex items-center justify-center">
          <Button variant="ghost" onClick={setRanks}><Image src={rankBool == true ? ALLbuttons.RANK_ON : ALLbuttons.RANK_OFF} alt="image" width={36} height={36}/></Button>
        </div>
      </div>
      <div className="flex grow bg-[#33437D]">
        {achievementBool && <Achievement/>}
        {historyBool && <History/>}
        {rankBool && <Rank/>}
      </div>
    </div>
  )
}

export default UserInfo;
