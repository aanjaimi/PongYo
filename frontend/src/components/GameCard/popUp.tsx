// components/SplitPopup.js
import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/contexts/game-context";
import { stat } from "fs";
import io from 'socket.io-client';


const popUp = ({ setIsPopupOpen, setGameStarted, selectedOption }) => {
  const { state, dispatch } = useStateContext();
  state.socket.on('gameStart', (data) => {
    // set user and opponent on state
    dispatch({ type: "SET_USER", payload: data.user });
    dispatch({ type: "SET_USER", payload: data.opp });
    setGameStarted(true);
    setIsPopupOpen(false);
  }
  );
  return (
    <div className=" fixed rounded-lg shadow-2xl flex text-white bg-[#ffffff33] flex-col z-10 w-[700px] h-[300px] px-6 ">
      {/* First Part */}
      <div className="flex h-full flex-row justify-between m-8 ">
        <div className=" flex justify-center flex-col">
          <Image
            src={state.user?.avatar}
            alt={state.user?.login}
            className="rounded-full mx-auto "
            width={140}
            height={140}
          />
          <h2 className="text-xl font-semibold text-center mt-4">
            {state.user?.login}
          </h2>
          <p className="text-gray-500 text-center">{state.user?.rank}</p>
        </div>
        <div className=" h-full flex flex-col ">
          <div className=" h-full flex justify-center items-end">
            <div className="animate-bounce flex flec-co">
              <span className="text-6xl font-bold mx-1">V</span>
              <span className="text-7xl font-bold text-blue-500 animate-pulse">S</span>
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-center " >
            <Button
              className="w-[140px] h-[40px] flex text-2xl  rounded-full bg-blue-500"
              onClick={() => {
                if(selectedOption === "Normal game")
                  state.socket.emit('leaveQueue', {user: state.user});
                else if(selectedOption === "Ranked game")
                  state.socket.emit('leaveRankedQueue', {user: state.user} );
                setIsPopupOpen(false)
              }}>
              cancel
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center  flex-col ">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-center mt-4 font-semibold ">Waiting for opponent...</p>
        </div>
      </div>

    </div>
  );
};
export default popUp;
