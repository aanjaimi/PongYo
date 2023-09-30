// components/SplitPopup.js
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/contexts/state-context";

const user = {
	name: "said alm9awad",
	image:"/smazouz.jpeg",
	rank: "Gold",
};
const popUp = ({setIsPopupOpen,setGameStarted}) => {
  const { state } = useStateContext();
  state.socket.on('gameStart', () => {
    setGameStarted(true);
    setIsPopupOpen(false);
  }
  );
  return (
      <div className=" fixed rounded-lg shadow-2xl flex text-white bg-[#ffffff33] flex-col z-10 w-[500px] h-[350px]">
        {/* First Part */}
				<div className="flex flex-row justify-between m-8">
        <div className="">
          <Image
            src={user.image}
            alt={user.name}
            className="rounded-full mx-auto "
						width={150}
						height={150}
						/>
          <h2 className="text-xl font-semibold text-center mt-4">
            {user.name}
          </h2>
          <p className="text-gray-500 text-center">{user.rank}</p>
        </div>

        {/* Second Part - Waiting Animation */}
        <div className="flex justify-center items-center  flex-col">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-center mt-4 font-semibold text-">Waiting for opponent...</p>
        </div>
				</div>
				<div className="w-full h-full flex items-center justify-center" >
				<Button
            className="w-[140px] h-[35px] flex text-2xl  rounded-full bg-blue-500"
            onClick={()=> {
              state.socket.emit('leaveQueue');
              setIsPopupOpen(false)}}>
            cancel
          </Button>
				</div>
      </div>
  );
};

export default popUp;
