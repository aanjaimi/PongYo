import React, { useState } from "react";
import GameCanvas from "./GameCanvas";
import GameResult from "../GameResult/GameResult";
import { useEffect } from "react";
import ImageCard from "./imageCard";

const Game = () => {
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        clearInterval(timer); // Stop the countdown when it reaches 0
      }
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div>
      {countdown > 0 && (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-9xl text-white">{countdown}</h1>
            <h1 className="text-3xl text-white">Game starts in</h1>
          </div>
        </div>
      )}
      {!isGameOver && (
        <div className="flex h-screen w-screen flex-col items-center justify-start sm:flex-row sm:justify-center">
          <ImageCard
            sideclass="h-full flex-col justify-start sm:w-auto w-full  sm:flex"
            className="mx-8 flex h-full flex-col items-end justify-end sm:h-[50%] sm:justify-center"
            score={myScore}
            size={75}
          />
          <div className="flex items-center justify-center px-2 py-3 sm:py-20">
            <GameCanvas
              setIsGameOver={setIsGameOver}
              setMyScore={setMyScore}
              setOppScore={setOppScore}
            />
          </div>
          <ImageCard
            sideclass="h-full flex-col justify-end sm:w-auto w-full sm:flex"
            className="mx-8 flex flex-col items-start justify-center sm:h-[50%]"
            score={oppScore}
            size={75}
          />
        </div>
      )}
      {isGameOver && <GameResult myScore={myScore} oppScore={oppScore} />}
    </div>
  );
};

export default Game;
