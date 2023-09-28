import React, { useState } from 'react';
import ImageCard from './ImageCard';
import GameCanvas from './GameCanvas';

const Game = () => {
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  return (
    <div className="flex flex-col sm:flex-row w-screen h-screen items-center justify-start sm:justify-center">
      <ImageCard
        sideclass="h-full flex-col justify-start sm:w-auto w-full  sm:flex"
        className="sm:h-[50%] h-full flex items-end sm:justify-center justify-end mx-8 flex-col"
        score={myScore}
        size={75}
      />
      <div className="flex justify-center items-center py-3 px-2 sm:py-20">
        <GameCanvas
          setMyScore={setMyScore}
          setOppScore={setOppScore}
          myScore={myScore}
          oppScore={oppScore}
        />
      </div>
      <ImageCard
        sideclass="h-full flex-col justify-end sm:w-auto w-full sm:flex"
        className="sm:h-[50%] flex items-start justify-center mx-8 flex-col"
        score={oppScore}
        size={75}
      />
    </div>
  );
};

export default Game;
