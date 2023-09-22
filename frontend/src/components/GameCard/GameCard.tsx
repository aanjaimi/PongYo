import React from "react";
import Image from "next/image";
import InvitedButton from "./InvitedButton";
import RadioButton from "./RadioBox";
import Divider from "./Divider";
import { Button } from "@/components/ui/button";

const GameCard = ({setGameStarted}) => {
	const handleStartClick = () => {
    setGameStarted(true);
  };
	const handleInviteClick = () => {
    // Handle the invite logic here...
  };

  const handleChange = (e) => {
    // Handle the radio button change here...
  };
	return (

    <div className="w-screen h-screen  flex justify-center items-center">
      <div className="h-[450px] w-[500px] rounded-xl flex flex-col" style={{ backgroundColor: '#33437D' }}>
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
            onClick={handleStartClick}
          >
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
    </div>
  );
}
export default GameCard;