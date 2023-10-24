import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Achievement from "../Achievement";
import History from "../History";
import Rank from "../LeaderBoard";
import { ALLbuttons } from "../../types/common";
import type { Achievements } from "@/types/achievement";
import { useStateContext } from "@/contexts/state-context";
import type { User } from "@/types/user";

type UserInfoProps = {
  user: User;
};

const UserInfo = ({ user }: UserInfoProps) => {
  const { state } = useStateContext();

  const [achievement, setAchievement] = useState<Achievements[] | undefined>(
    state.user?.achievement
  );

  const [achievementBool, setAchievementBool] = useState<boolean>(true);
  const [historyBool, setHistoryBool] = useState<boolean>(false);
  const [rankBool, setRankBool] = useState<boolean>(false);

  const setAchievements = () => {
    setAchievementBool(true);
    setHistoryBool(false);
    setRankBool(false);
  };

  const setHistories = () => {
    setHistoryBool(true);
    setRankBool(false);
    setAchievementBool(false);
  };

  const setRanks = () => {
    setRankBool(true);
    setAchievementBool(false);
    setHistoryBool(false);
  };

  return (
    <>
      {user.isCompleted && (
        <div className="border mb-[3rem] mt-[36px] flex h-[419px] w-[413px] flex-col rounded-2xl md:w-[613px] lg:w-[968px]">
          <div className="ml-[6px] mr-[6px] flex h-[60px] w-[400px] items-center justify-center border-b-[2px] md:w-[600px] lg:w-[955px]">
            <div className="flex h-[51px] w-[322px] items-center justify-center border-r-[2px]">
              <Button variant="ghost" onClick={setAchievements}>
                <i data-lucide="medal"></i>
              </Button>
            </div>
            <div className="flex h-[51px] w-[322px] items-center justify-center border-r-[2px]">
              <Button variant="ghost" onClick={setHistories}>
                <i data-lucide="medal"></i>
              </Button>
            </div>
            <div className="flex h-[51px] w-[322px] items-center justify-center">
              <Button variant="ghost" onClick={setRanks}>
                <i data-lucide="medal"></i>
              </Button>
            </div>
          </div>
          <div className="flex grow">
            {achievementBool && <Achievement />}
            {historyBool && <History />}
            {rankBool && <Rank />}
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
