// components/SplitPopup.js
import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/contexts/socket-context";
import { stat } from "fs";
import io from "socket.io-client";
import { useStateContext } from "@/contexts/game-context";

const PopUp = ({ setIsPopupOpen, setGameStarted, selectedOption }) => {
  const { gameSocket } = useSocket();
  const { state, dispatch } = useStateContext();

  useEffect(() => {
    gameSocket.on("gameStart", (data) => {
      // set user and opponent on state
      dispatch({ type: "SET_USER", payload: data.user });
      dispatch({ type: "SET_USER", payload: data.opp });
      setGameStarted(true);
      setIsPopupOpen(false);
    });
  });
  return (
    <div className=" fixed z-10 flex h-[300px] w-[700px] flex-col rounded-lg bg-[#ffffff33] px-6 text-white shadow-2xl ">
      {/* First Part */}
      <div className="m-8 flex h-full flex-row justify-between ">
        <div className=" flex flex-col justify-center">
          <Image
            src={state.user?.avatar}
            alt={state.user?.login}
            className="mx-auto rounded-full "
            width={140}
            height={140}
          />
          <h2 className="mt-4 text-center text-xl font-semibold">
            {state.user?.login}
          </h2>
          <p className="text-center text-gray-500">{state.user?.rank}</p>
        </div>
        <div className=" flex h-full flex-col ">
          <div className=" flex h-full items-end justify-center">
            <div className="flec-co flex animate-bounce">
              <span className="mx-1 text-6xl font-bold">V</span>
              <span className="animate-pulse text-7xl font-bold text-blue-500">
                S
              </span>
            </div>
          </div>
          <div className="flex h-full w-full items-center justify-center ">
            <Button
              className="flex h-[40px] w-[140px] rounded-full  bg-blue-500 text-2xl"
              onClick={() => {
                if (selectedOption === "Normal game")
                  gameSocket.emit("leaveQueue", { user: state.user });
                else if (selectedOption === "Ranked game")
                  gameSocket.emit("leaveRankedQueue", { user: state.user });
                setIsPopupOpen(false);
              }}
            >
              cancel
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center  justify-center ">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-center font-semibold ">
            Waiting for opponent...
          </p>
        </div>
      </div>
    </div>
  );
};
export default PopUp;
