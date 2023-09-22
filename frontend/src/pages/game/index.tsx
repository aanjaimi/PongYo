import React, { useState } from "react";
import Game from "@/components/Game/Game";
import GameCard from "@/components/GameCard/GameCard";

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div>
      {gameStarted ? <Game /> : <GameCard setGameStarted={setGameStarted} />}
    </div>
  );
};

export default Home;
