import React, { useState, useEffect, use } from "react";
import InvitedButton from "./InvitedButton";
import Divider from "./Divider";
import { Button } from "@/components/ui/button"
import PopUp from "./popUp";
import { useSocket } from "@/contexts/socket-context";
import CustomModal from "./CustomModal";
import { useStateContext } from "@/contexts/state-context";
import { toast } from "react-toastify";
import type { User } from "@/types/user";
import type { ChangeEvent } from "react";
import InvitationCard from "./inviteCard";
import { useRouter } from "next/router";
import {
  Card, CardTitle,
} from "@/components/ui/card"
import { stat } from "fs";


type GameCardProps = {
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setOppData: React.Dispatch<React.SetStateAction<User>>;
  setIsRanked: React.Dispatch<React.SetStateAction<boolean>>;
};
const GameCard = ({ setGameStarted, setOppData, setIsRanked }: GameCardProps) => {
  const { gameSocket } = useSocket();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [inviteNotify, setInviteNotify] = useState(false);
  const [friend, setFriend] = useState("");
  const handleStartClick = () => {
    console.log(selectedOption);
    if (selectedOption === "Normal game") {
      console.log("join-queue");
      setIsRanked(false);
      gameSocket.emit("join-queue");
    } else if (selectedOption === "Ranked game") {
      setIsRanked(true);
      gameSocket.emit("join-ranked-queue");
    } else {
      setShowValidation(true);
    }
  };

  const handleCloseValidation = () => {
    setShowValidation(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const notifyError = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  useEffect(() => {

    const handleAlreadyInQueue = (data: { msg: string }) => {
      notifyError(data.msg);
    };

    const handleQueueJoined = () => {
      gameSocket.emit("readyToPlay");
      setIsPopupOpen(true);
    };

    gameSocket.on("already-in-Queue", handleAlreadyInQueue);
    gameSocket.on("queue-joined", handleQueueJoined);
    return () => {
      gameSocket.off("already-in-Queue", handleAlreadyInQueue);
      gameSocket.off("queue-joined", handleQueueJoined);
    };
  }, []);

  return (
    <Card className="flex h-screen   flex-col items-center justify-center grow ">
      {inviteNotify && (
        <InvitationCard
          setInviteNotify={setInviteNotify}
          opp={friend}
          setIsRanked={setIsRanked}
          setGameStarted={setGameStarted}
          setOppData={setOppData}
        />
      )}
      {isPopupOpen && (
        <PopUp
          setOppData={setOppData}
          setIsRanked={setIsRanked}
          setGameStarted={setGameStarted}
          setIsPopupOpen={setIsPopupOpen}
          selectedOption={selectedOption}
        />
      )}

      {!isPopupOpen && !inviteNotify && (
        <div className="flex sm:h-[450px] sm:w-[500px] w-[320px] h-[350px]  flex-col rounded-xl bg-white border-4 text-black ">
          <CardTitle className="sm:text-3xl text-xl sm:pt-5 sm:pl-5 pt-2 pl-2">Start A Game :</CardTitle>
          <div className="flex space-x-16 sm:pl-16 pl-4 pt-5 text-sm text-black ">
            <div className="sm:space-x-4 space-x-2">
              <input
                type="radio"
                id="normalGame"
                name="gameType"
                value="Normal game"
                checked={selectedOption === "Normal game"}
                onChange={handleChange}
              />
              <label className="sm:text-lg " htmlFor="normalGame">Normal game
              </label>
            </div>
            <div className="sm:space-x-4 space-x-2">
              <input
                type="radio"
                id="rankedGame"
                name="gameType"
                value="Ranked game"
                checked={selectedOption === "Ranked game"}
                onChange={handleChange}
              />
              <label className="sm:text-lg" htmlFor="rankedGame">Ranked game</label>
            </div>
          </div>

          <div className="mt-8 flex w-full items-center justify-center text-xl ">
            <Button
              className="flex sm:h-[40px] sm:w-[140px] rounded-full  text-2xl"
              onClick={handleStartClick}
            >
              Start
            </Button>
          </div>
          <Divider />
          <CardTitle className="sm:text-3xl text-xl pt-5 pl-5">Invite A Friend :</CardTitle>
          <div className="sm:mt-6 flex items-center pt-2 text-xl text-white">
            <InvitedButton setInviteNotify={setInviteNotify} setFriend={setFriend} />
          </div>
        </div>
      )}
      {showValidation && <CustomModal onClose={handleCloseValidation} />}
    </Card>
  );
};

export default GameCard;