import React, { useState } from 'react';
import ImageCard from './ImageCard';
import GameCanvas from './GameCanvas';
import GameResult from '../GameResult/GameResult';
import { useStateContext } from '@/contexts/game-context';

const Game = () => {
  const [isGameOver, setIsGameOver] = React.useState(false);
  const { state, dispatch } = useStateContext();
  return (
    <div>
    {!isGameOver &&
    <div className="flex flex-col sm:flex-row w-screen h-screen items-center justify-start sm:justify-center">
      <ImageCard
        sideclass="h-full flex-col justify-start sm:w-auto w-full  sm:flex"
        className="sm:h-[50%] h-full flex items-end sm:justify-center justify-end mx-8 flex-col"
        score={state.user?.score}
        size={75}
      />
      <div className="flex justify-center items-center py-3 px-2 sm:py-20">
        <GameCanvas
          setIsGameOver={setIsGameOver}
        />
      </div>
      <ImageCard
        sideclass="h-full flex-col justify-end sm:w-auto w-full sm:flex"
        className="sm:h-[50%] flex items-start justify-center mx-8 flex-col"
        score={state.opp?.score}
        size={75}
      />
    </div>
    }
    {isGameOver && <GameResult/>}
    </div>
  );
};

export default Game;
