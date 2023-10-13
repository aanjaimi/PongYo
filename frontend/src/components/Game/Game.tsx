import React, { useState } from 'react';
import ImageCard from './ImageCard';
import GameCanvas from './GameCanvas';
import GameResult from '../GameResult/GameResult';
import { useStateContext } from '@/contexts/game-context';
import { useEffect } from 'react';

const Game = () => {
  const [isGameOver, setIsGameOver] = React.useState(false);
 const {socketGame} = useSocket();
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
      else {
        clearInterval(timer); // Stop the countdown when it reaches 0
      }
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div>
      {countdown > 0 && <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-9xl text-white">{countdown}</h1>
          <h1 className="text-3xl text-white">Game starts in</h1>
        </div>
      </div>}
      {!isGameOver &&
        <div className="flex flex-col sm:flex-row w-screen h-screen items-center justify-start sm:justify-center">
          <ImageCard
            sideclass="h-full flex-col justify-start sm:w-auto w-full  sm:flex"
            className="sm:h-[50%] h-full flex items-end sm:justify-center justify-end mx-8 flex-col"
            score={myScore}
            size={75}
          />
          <div className="flex justify-center items-center py-3 px-2 sm:py-20">
            <GameCanvas
              setIsGameOver={setIsGameOver}
              setMyScore={setMyScore}
              setOppScore={setOppScore}
            />
          </div>
          <ImageCard
            sideclass="h-full flex-col justify-end sm:w-auto w-full sm:flex"
            className="sm:h-[50%] flex items-start justify-center mx-8 flex-col"
            score={oppScore}
            size={75}
          />
        </div>
      }
      {isGameOver && <GameResult myScore={myScore} oppScore={oppScore} />}
    </div>
  );
};

export default Game;
