import React, { useState } from "react";
import Game from "@/components/Game/Game";
import GameCard from "@/components/GameCard/GameCard";
import io from 'socket.io-client';
import { useEffect } from 'react';
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { StateProvider } from "@/contexts/game-context";

const getCurrentUser = async () => {
  const resp = await fetcher.get<User>("/users/@me");
  return resp.data;
};

const home = () => {
  //const {socketGame} = useSocket();
  // const userQurey = useQuery({
  //   queryKey: ["users"],
  //   queryFn: getCurrentUser,
  //   onSuccess: (data) => {
  //     dispatch({ type: "SET_USER", payload: data });
  //   },
  //   onError: (err) => {
  //     console.error(err);
  //     dispatch({ type: "SET_USER", payload: null });
  //   },
  // });
  // useEffect(() => {
  //   // gameSocket.connect();
  // }
  // , []);
  const [gameStarted, setGameStarted] = useState(false);
  const [user, setUser] = useState({login: "smazouz", image: "/smazouz.jpeg", rank: "Gold",Score:0});
  const [opp, setOpponent] = useState({login: "opponent", image: "/smazouz.jpeg", rank: "Gold", Score:0});
  // if (userQurey.isLoading) return <div className="w-screen h-screen flex justify-center items-center font-black text-[40px]">Loading...</div>;
  // if (userQurey.isError) return <div className="w-screen h-screen flex justify-center items-center font-black text-[40px]">Error</div>;

  return (
    <StateProvider>
      <div>
        {gameStarted ? <Game  /> : <GameCard setGameStarted={setGameStarted} />}
      </div>
    </StateProvider>
  );
};

export default home;