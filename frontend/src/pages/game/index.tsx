import React, { useState } from "react";
import GameCard from "@/components/GameCard/GameCard";

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  return (
    <div>
      {gameStarted ? <Game /> : <GameCard setGameStarted={setGameStarted} />}
    </div>
  );
};

export default Game;
