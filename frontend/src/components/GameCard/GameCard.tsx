import React, { use, useState } from "react";
import Image from "next/image";
import InvitedButton from "./InvitedButton";
import Divider from "./Divider";
import { Button } from "@/components/ui/button";
import PopUp from "./popUp";
import io from 'socket.io-client';
import { useStateContext } from "@/contexts/game-context";
import CustomModal from "./CustomModal"; // Import the custom modal component
import { stat } from "fs";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StateProvider } from "@/contexts/game-context";


const GameCard = ({ setGameStarted }) => {
  const { state, dispatch } = useStateContext();
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Initial value as an empty string
  const [showValidation, setShowValidation] = useState(false); // State for showing the validation modal
  useEffect(() => {
    const userData = { login: "smazouz", avatar: "/smazouz.jpeg", rank: "Gold", score: 0 , resoult: "winner"};
    dispatch({ type: "SET_USER", payload: userData });
    state.socket.connect();
  }
  , []);
  const handleStartClick = () => {
    if (selectedOption === "Normal game" || selectedOption === "Ranked game") {
      setIsPopupOpen(true);
      if (selectedOption === "Normal game") {
        state.socket.emit('joinQueue', {user: state.user});
      } else if (selectedOption === "Ranked game") {
        state.socket.emit('joinRankedQueue', {user: state.user});
      }
    } else {
      setShowValidation(true);
    }
  };

  const handleCloseValidation = () => {
    setShowValidation(false);
  };


  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      {isPopupOpen && <PopUp setIsPopupOpen={setIsPopupOpen} selectedOption={selectedOption} setGameStarted={setGameStarted}/>}
      {!isPopupOpen && (
        <div className="h-[450px] w-[500px] rounded-xl flex flex-col bg-[#33437D]">
          <div className="pt-7">
            <h1 className="text-3xl text-white pl-5 "> Start A Game :</h1>
          </div>
          <div className="pt-5 pl-16 flex text-white text-sm space-x-16">
            <div className="space-x-4">
              <input
                type="radio"
                id="normalGame"
                name="gameType"
                value="Normal game"
                checked={selectedOption === "Normal game"}
                onChange={handleChange}
              />
              <label htmlFor="normalGame">Normal game</label>
            </div>
            <div className="space-x-4">
              <input
                type="radio"
                id="rankedGame"
                name="gameType"
                value="Ranked game"
                checked={selectedOption === "Ranked game"}
                onChange={handleChange}
              />
              <label htmlFor="rankedGame">Ranked game</label>
            </div>
          </div>
          <div className="w-full flex text-white text-xl items-center justify-center mt-8">
            <Button
              className="w-[140px] h-[40px] flex text-2xl rounded-full bg-blue-500"
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
            <InvitedButton />
          </div>
        </div>
      )}

      {/* Display the custom validation modal */}
      {showValidation && (
        <CustomModal
          onClose={handleCloseValidation}
        />
      )}
    </div>
  );
}

export default GameCard;
