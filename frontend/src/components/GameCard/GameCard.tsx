import React from "react";
import Image from "next/image";
import InvitedButton from "./InvitedButton";
import RadioButton from "./RadioBox";
import Divider from "./Divider";
import { Button } from "@/components/ui/button";
import PopUp from "./popUp";
import io from 'socket.io-client';
const GameCard = ({setGameStarted}) => {
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
	const handleStartClick = () => {
    setIsPopupOpen(true);
  };
	const handleInviteClick = () => {
  };

  const handleChange = (e) => {
  };
	return (
    <div className="flex flex-col w-screen h-screen   justify-center items-center  ">
      {isPopupOpen && <PopUp setIsPopupOpen={setIsPopupOpen}/>}
      {!isPopupOpen &&
      <div className="h-[450px] w-[500px] rounded-xl flex flex-col bg-[#33437D]">
        <div className="pt-7">
          <h1 className="text-3xl text-white pl-5 "> Start A Game :</h1>
        </div>
        <div className="pt-5 pl-16 flex text-white text-sm space-x-16">
          <RadioButton value="Normal game" label="Normal game" onChange={handleChange} />
          <RadioButton value="Ranked game" label="Ranked game" onChange={handleChange} />
        </div>
        <div className="w-full flex text-white  text-xl  items-center justify-center mt-8 ">
          <Button
            className="w-[140px] h-[40px] flex text-2xl  rounded-full bg-blue-500"
            onClick={handleStartClick}>
            Start
          </Button>
        </div>
        <Divider />
        <div className="flex mt-10">
          <h1 className="text-3xl text-white pl-5 "> INVITE YOUR FRIEND :</h1>
        </div>
        <div className="mt-6 flex text-white text-xl items-center pt-2">
          <InvitedButton onInviteClick={handleInviteClick} />
        </div>
    </div>
    }
  </div>
  
);
}
export default GameCard;