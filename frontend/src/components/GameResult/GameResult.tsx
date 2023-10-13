import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import VsCard from "./VsCard";
import { useSocket } from "@/contexts/socket-context";

const GameResult = ({myScore, oppScore}) => {
 const {socketGame} = useSocket();
  console.log(state.opp);
  console.log(state.user);
  let firstColor =
    myScore > oppScore
      ? { color: "gold", textClass: "text-yellow-300" }
      : { color: "silver", textClass: "text-gray-300" };
  let secondColor =
    myScore < oppScore
      ? { color: "gold", textClass: "text-yellow-300" }
      : { color: "silver", textClass: "text-gray-300" };

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
                {state.user?.resoult}
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
              <p className="font-semibold">{state.opp?.login}</p>
              <p className={`animate-pulse ${secondColor.textClass}`}>
                {state.opp?.resoult}
              </p>
            </div>
            <img
              src={"/smazouz.jpeg" || state.opp?.avatar}
              alt={state.opp?.login}
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
