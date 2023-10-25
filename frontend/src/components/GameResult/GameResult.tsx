import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import VsCard from "./VsCard";
import { useStateContext } from "@/contexts/state-context";
import type { User } from "@/types/user";
import Image from "next/image";

type GameResultProps = {
  myScore: number;
  oppScore: number;
  oppData: User;
};
const GameResult = ({ myScore, oppScore, oppData }: GameResultProps) => {

  const { state } = useStateContext();
  const firstPlayerStyle =
    myScore > oppScore
      ? { color: "gold", textClass: "text-yellow-300", resoult: "Winner" }
      : { color: "silver", textClass: "text-gray-300", resoult: "Loser" };
  const secondPlayerStyle =
    myScore < oppScore
      ? { color: "gold", textClass: "text-yellow-300", resoult: "Winner" }
      : { color: "silver", textClass: "text-gray-300", resoult: "Loser" };
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex justify-around items-center text-black sm:h-[230px] sm:w-[700px] text-lg rounded-3xl p-4 flex-col sm:flex-row border-4 ">
        <div>
          <div className="flex items-center">
            <Image
              src={state.user?.avatar || '/smazouz.jpeg'}
              alt={state.user?.login}
              width={100}
              height={100}
              className="rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{state.user?.login}</p>
              <p className={`animate-pulse ${firstPlayerStyle.textClass}`}>
                {firstPlayerStyle.resoult}
              </p>
            </div>
          </div>
          <div className="w-full flex items-end justify-start p-7 border-black">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2xl"
              color={firstPlayerStyle.color}
            />
          </div>
        </div>
        <VsCard myScore={myScore} oppScore={oppScore} />
        <div>
          <div className="flex items-center">
            <div>
              <p className="font-semibold">{oppData?.login}</p>
              <p className={`animate-pulse ${secondPlayerStyle.textClass}`}>
                {secondPlayerStyle.resoult}
              </p>
            </div>
          <Image
              src={oppData?.avatar || '/smazouz.jpeg'}
              alt={oppData?.login}
              width={100}
              height={100}
              className="rounded-full ml-4"
            />
          </div>
          <div className="w-full flex items-end justify-end border-black p-7">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2xl"
              color={secondPlayerStyle.color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
