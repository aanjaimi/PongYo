import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import VsCard from "./VsCard";
import { useStateContext } from "@/contexts/state-context";
import type { User } from "@/types/user";

type GameResultProps = {
  myScore: number;
  oppScore: number;
  oppData: User;
};
const GameResult = ({myScore, oppScore, oppData}:GameResultProps) => {
  
  const { state } = useStateContext();
  console.log(oppData);
  console.log(state.user);
  const firstColor =
    myScore > oppScore
      ? { color: "gold", textClass: "text-yellow-300" , resoult: "Winner"}
      : { color: "silver", textClass: "text-gray-300" , resoult: "Loser"};
  const secondColor =
    myScore < oppScore
      ? { color: "gold", textClass: "text-yellow-300", resoult: "Winner" }
      : { color: "silver", textClass: "text-gray-300", resoult: "Loser" };
  console.log(firstColor);
  console.log(secondColor);
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex justify-around items-center text-white bg-[#ffffff33] sm:h-[230px] sm:w-[700px] text-lg rounded-lg p-4 flex-col sm:flex-row">
        <div>
          <div className="flex items-center">
            <img
              src={state.user?.avatar || "/smazouz.jpeg"}
              alt={state.user?.login}
              className="w-24 h-24 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{state.user?.login}</p>
              <p className={`animate-pulse ${firstColor.textClass}`}>
                {firstColor.resoult}
              </p>
            </div>
          </div>
          <div className="w-full flex items-end justify-start p-7 border-black">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2xl"
              color={firstColor.color}
            />
          </div>
        </div>
        <VsCard myScore={myScore} oppScore={oppScore} />
        <div>
          <div className="flex items-center">
            <div>
              <p className="font-semibold">{oppData?.login}</p>
              <p className={`animate-pulse ${secondColor.textClass}`}>
                {secondColor.resoult}
              </p>
            </div>
            <img
              src={"/smazouz.jpeg" || oppData?.avatar}
              alt={oppData?.login}
              className="w-24 h-24 rounded-full ml-4 "
            />
          </div>
          <div className="w-full flex items-end justify-end border-black p-7">
            <FontAwesomeIcon
              icon={faTrophy}
              size="2xl"
              color={secondColor.color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
