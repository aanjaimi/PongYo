import React, { useState } from "react";
import GameCard from "@/components/GameCard/GameCard";
import Game from "@/components/Game/Game";
import type { User } from "@/types/user";
import { useStateContext } from "@/contexts/state-context";

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isRanked, setIsRanked] = useState(false);
  const [oppData, setOppData] = useState({} as User)
  const {state} = useStateContext();

  if(state.auth_status === "loading"){
    return (
      <div className="flex h-screen w-screen">
        Loading...
      </div>
      )
    }
  return (
    <div className="w-screen h-screen">
      {gameStarted ? <Game oppData={oppData} isRanked={isRanked} /> :
        <GameCard setGameStarted={setGameStarted} setOppData={setOppData} setIsRanked={setIsRanked} />}
    </div>
  );
};

export default Home;