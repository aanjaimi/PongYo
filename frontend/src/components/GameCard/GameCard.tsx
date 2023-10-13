import React, { use, useState } from "react";
import Image from "next/image";
import InvitedButton from "./InvitedButton";
import Divider from "./Divider";
import { Button } from "@/components/ui/button";
import PopUp from "./popUp";
import io from "socket.io-client";
import { useSocket } from "@/contexts/socket-context";
import CustomModal from "./CustomModal"; // Import the custom modal component
import { stat } from "fs";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StateProvider, useStateContext } from "@/contexts/game-context";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";
import { Socket } from "dgram";

const getCurrentUser = async () => {
  const resp = await fetcher.get<User>("/users/@me");
  return resp.data;
};

const GameCard = ({ setGameStarted }) => {
  const { gameSocket } = useSocket();
  const { state, dispatch } = useStateContext();
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Initial value as an empty string
  const [showValidation, setShowValidation] = useState(false);
  const userQurey = useQuery({
    queryKey: ["users"],
    queryFn: getCurrentUser,
    onSuccess: (data) => {
      dispatch({ type: "SET_USER", payload: data });
      if (!gameSocket.connected) {
        gameSocket.connect();
      }
    },
    onError: (err) => {
      console.error(err);
      dispatch({ type: "SET_USER", payload: null });
    },
  });
  const handleStartClick = () => {
    if (selectedOption === "Normal game" || selectedOption === "Ranked game") {
      setIsPopupOpen(true);
      if (selectedOption === "Normal game") {
        console.log("Normal game clicked");
        gameSocket.emit("joinQueue");
      } else if (selectedOption === "Ranked game") {
        gameSocket.emit("joinRankedQueue");
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
  useEffect(() => {
    gameSocket.on("gameStart", (data) => {
      setGameStarted(true);
    });
    gameSocket.on("inviting", (data) => {
      console.log("inviteToGame");
      gameSocket.emit("acceptInvite", {
        user: state.user,
        friend: data.login,
      });
    });
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      {isPopupOpen && (
        <PopUp
          setIsPopupOpen={setIsPopupOpen}
          selectedOption={selectedOption}
          setGameStarted={setGameStarted}
        />
      )}
      {!isPopupOpen && (
        <div className="flex h-[450px] w-[500px] flex-col rounded-xl bg-[#33437D]">
          <div className="pt-7">
            <h1 className="pl-5 text-3xl text-white "> Start A Game :</h1>
          </div>
          <div className="flex space-x-16 pl-16 pt-5 text-sm text-white">
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
          <div className="mt-8 flex w-full items-center justify-center text-xl text-white">
            <Button
              className="flex h-[40px] w-[140px] rounded-full bg-blue-500 text-2xl"
              onClick={handleStartClick}
            >
              Start
            </Button>
          </div>
          <Divider />
          <div className="mt-10 flex">
            <h1 className="pl-5 text-3xl text-white "> INVITE YOUR FRIEND :</h1>
          </div>
          <div className="mt-6 flex items-center pt-2 text-xl text-white">
            <InvitedButton setGameStarted={setGameStarted} />
          </div>
        </div>
      )}

      {/* Display the custom validation modal */}
      {showValidation && <CustomModal onClose={handleCloseValidation} />}
    </div>
  );
};

export default GameCard;
