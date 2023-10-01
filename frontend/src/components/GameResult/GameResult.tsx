import React, { useState } from "react";
import Game from "@/components/Game/Game";
import GameCard from "@/components/GameCard/GameCard";
import io from 'socket.io-client';
import { useEffect } from 'react';
import { useStateContext } from "@/contexts/state-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import VsCard from "./VsCard";

const player1 = {
  name: "said alm9awad",
  image: "/smazouz.jpeg",
  result: "Winner",
  score: 5
};
const player2 = {
  name: "ayoub zob",
  image: "https://cdn.intra.42.fr/users/c9aebfe9ac5400d75b199a12efa7682b/aanjaimi.jpg",
  result: "Loser",
}

const GameResult = ({myScore, oppScore}) => {
	player1.score = myScore;
	player2.score = oppScore;
  return (
    <div className="flex w-screen h-screen justify-center items-center ">
      <div className="flex justify-around items-center  text-white bg-[#ffffff33] sm:h-[230px] sm:w-[700px] text-lg rounded-lg p-4 flex-col sm:flex-row  ">
        <div className="">
          <div className="flex items-center">
            <img
              src={player1.image}
              alt={player1.name}
              className="w-24 h-24 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{player1.name}</p>
              <p className="animate-pulse text-yellow-300">{player1.result}</p>
            </div>
          </div>
          <div className=" w-full flex items-end justify-start p-7 border-black">
            <FontAwesomeIcon icon={faTrophy} size="2xl" color="gold" />
          </div>
        </div>
          <VsCard myScore={player1.score} oppScore={player2.score}/>
        <div>
          <div className="flex items-center">
            <div>
              <p className="font-semibold">{player2.name}</p>
              <p className="animate-pulse  text-gray-300">{player2.result}</p>
            </div>
            <img
              src={player2.image}
              alt={player2.name}
              className="w-24 h-24 rounded-full ml-4"
            />
          </div>
          <div className=" w-full flex items-end justify-end border-black p-7 ">
            <FontAwesomeIcon icon={faTrophy} size="2xl" color="silver" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
