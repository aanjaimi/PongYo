import React, { useState, useEffect } from "react";
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

const getCurrentUser = async () => {
  const resp = await fetcher.get<User>("/users/@me");
  return resp.data;
};

const GameCard = ({ setGameStarted,setOppData }: GameCardProps) => {
  const { gameSocket } = useSocket();
  const { state, dispatch } = useStateContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: getCurrentUser,
    onSuccess: (data) => {
      dispatch({ type: "SET_USER", payload: data });
      console.log("user");
      console.log(state.user);
      if (!gameSocket.connected) {
        gameSocket.connect();
      }
    },
    onError: (err) => {
      console.log("error");
      console.error(err);
      dispatch({ type: "SET_USER", payload: null });
    },
  });

  const handleStartClick = () => {
    if (selectedOption === "Normal game") {
      console.log("Normal game clicked");
      gameSocket.emit("joinQueue");
    } else if (selectedOption === "Ranked game") {
      gameSocket.emit("joinRankedQueue");
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
    const handleAlreadyInQueue = (data:{msg:string}) => {
      console.log(data);
      notifyError(data.msg);
    };

    const handleQueueJoined = () => {
      setIsPopupOpen(true);
    };

    const handleGameStart = (data:{opp:User}) => {
      console.log("gameStart");
      setOppData(data.opp);
      setGameStarted(true);
      setIsPopupOpen(false);
    };

    gameSocket.on("alreadyInQueue", handleAlreadyInQueue);
    gameSocket.on("queueJoined", handleQueueJoined);
    gameSocket.on("gameStart", handleGameStart);

    return () => {
      gameSocket.off("alreadyInQueue", handleAlreadyInQueue);
      gameSocket.off("gameStart", handleGameStart);
      gameSocket.off("queueJoined", handleQueueJoined);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      {isPopupOpen && (
        <PopUp
          setIsPopupOpen={setIsPopupOpen}
          selectedOption={selectedOption}
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
            <InvitedButton />
          </div>
        </div>
      )}

      {/* Display the custom validation modal */}
      {showValidation && <CustomModal onClose={handleCloseValidation} />}
    </div>
  );
};

export default GameCard;