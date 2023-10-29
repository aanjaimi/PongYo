import React, { useState } from "react";
import GameCard from "@/components/GameCard/GameCard";
import Game from "@/components/Game/Game";
import type { User } from "@/types/user";

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isRanked, setIsRanked] = useState(false);
  const [oppData, setOppData] = useState({} as User)

  return (
    <div className="w-full h-full">
      {gameStarted ? <Game oppData={oppData} isRanked={isRanked} /> :
        <GameCard setGameStarted={setGameStarted} setOppData={setOppData} setIsRanked={setIsRanked} />}
    </div>
  );
};

export default Home;