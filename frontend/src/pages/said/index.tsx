import React from "react";
import Game from "@/components/Game/Game";
import GameCard from "@/components/GameCard/GameCard";
import io from 'socket.io-client';
import { useEffect } from 'react';
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { StateProvider } from "@/contexts/game-context";
import socketIOClient from 'socket.io-client';
import Cookies from 'js-cookie';

const home = () => {
  // Replace 'your_token_here' with the actual token you want to use
  useEffect(() => {
    const Cookies = require('js-cookie');
    const token = Cookies.get('auth-token');
    const socket =  io('http://localhost:5000/game', {extraHeaders: {
      Auth: `${token}`,
    }});
    socket.emit('joinQueue');
    return () => {
      socket.disconnect();

    };
  }, []);
  return (
    <StateProvider>
      <div>
        <h1>hello</h1>
      </div>
    </StateProvider>
  );
};

export default home;