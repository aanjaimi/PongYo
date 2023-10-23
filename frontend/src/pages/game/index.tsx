import React, { useState } from "react";
import GameCard from "@/components/GameCard/GameCard";
import Game from "@/components/Game/Game";
import type { User } from "@/types/user";

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [oppData, setOppData] = useState({} as User)

  return (
    <div>
      {gameStarted ? <Game oppData={oppData} /> : <GameCard setGameStarted={setGameStarted} setOppData={setOppData} />}
    </div>
  );
};

export default Home;