import React, { useState, useEffect, use } from "react";
import InvitedButton from "./InvitedButton";
import Divider from "./Divider";
import { Button } from "@/components/ui/button";
import PopUp from "./popUp";
import { useSocket } from "@/contexts/socket-context";
import CustomModal from "./CustomModal";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { useStateContext } from "@/contexts/state-context";
import { toast } from "react-toastify";
import type { User } from "@/types/user";
import type { ChangeEvent } from "react";
import type { GameCardProps } from "../gameTypes/types";
import InvitationCard from "./inviteCard";
import { useRouter } from "next/router";
const getCurrentUser = async () => {
  const resp = await fetcher.get<User>("/users/@me");
  return resp.data;
};

const GameCard = ({ setGameStarted,setOppData }: GameCardProps) => {
  const { gameSocket } = useSocket();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [inviteNotify, setInviteNotify] = useState(false);
  const [friend , setFriend] = useState({} as User);
  const router = useRouter();
  const { state,dispatch } = useStateContext(); 
  const handleStartClick = () => {
    if (selectedOption === "Normal game") {
      gameSocket.emit("join-queue");
    } else if (selectedOption === "Ranked game") {
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

  const notifyError = (message:string) => {
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
    if(!state.user)
    router.push("/profile/@me").catch((err) => console.error(err));
    if (!gameSocket.connected) {
      gameSocket.connect();
    }
    const handleAlreadyInQueue = (data:{msg:string}) => {
      notifyError(data.msg);
    };

    const handleQueueJoined = () => {
      setIsPopupOpen(true);
    };

    const handleGameStart = (data:{opp:User}) => {
      setOppData(data.opp);
      setIsPopupOpen(false);
      setInviteNotify(false);
      setGameStarted(true);
    };

    gameSocket.on("already-in-Queue", handleAlreadyInQueue);
    gameSocket.on("queue-joined", handleQueueJoined);
    gameSocket.on("game-start", handleGameStart);

    return () => {
      gameSocket.off("already-in-Queue", handleAlreadyInQueue);
      gameSocket.off("game-start", handleGameStart);
      gameSocket.off("queue-joined", handleQueueJoined);
    };
  }, []);

  return (
    <div className="flex  flex-col items-center justify-center grow">
      {inviteNotify && (
        <InvitationCard
          setInviteNotify={setInviteNotify}
          opp={friend}
        />
      )}
      {isPopupOpen && (
        <PopUp
          setIsPopupOpen={setIsPopupOpen}
          selectedOption={selectedOption}
        />
      )}

      {!isPopupOpen && !inviteNotify  && (
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
              <label htmlFor="normalGame">Normal game
              </label>
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
            <InvitedButton setInviteNotify={setInviteNotify} setFriend={setFriend}/>
          </div>
        </div>
      )}
      {showValidation && <CustomModal onClose={handleCloseValidation} />}
    </div>
  );
};

export default GameCard;