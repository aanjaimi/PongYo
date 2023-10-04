import React, { useState } from "react";
import Game from "@/components/Game/Game";
import GameCard from "@/components/GameCard/GameCard";
import io from 'socket.io-client';
import { useEffect } from 'react';
import { useStateContext } from "@/contexts/state-context";


const home = () => {
  const { state } = useStateContext();
  useEffect(() => {
    state.socket.connect();
  }
  , []);
  const [gameStarted, setGameStarted] = useState(false);
  return (
    <div>
      {gameStarted ? <Game /> : <GameCard setGameStarted={setGameStarted} />}
    </div>
  );
};

export default home;