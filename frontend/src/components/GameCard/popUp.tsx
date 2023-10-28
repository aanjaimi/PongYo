// components/SplitPopup.js
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/contexts/socket-context";
import { useStateContext } from "@/contexts/state-context";
import { Card } from "@nextui-org/react";
import { useEffect } from "react";
import type { User } from "@/types/user";

export type PopUpProps = {
  setIsPopupOpen: (value: boolean) => void;
  selectedOption: string;
  setOppData: React.Dispatch<React.SetStateAction<User>>;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRanked: React.Dispatch<React.SetStateAction<boolean>>;
};

const PopUp = ({ setIsPopupOpen, selectedOption, setOppData, setGameStarted, setIsRanked }: PopUpProps) => {
  const { gameSocket } = useSocket();
  const { state } = useStateContext();

  const handleGameStart = (data: { opp: User, isRanked: boolean }) => {
    setGameStarted(true);
    setIsRanked(data.isRanked);
    setOppData(data.opp);
  };
  useEffect(() => {
    gameSocket.on("game-start", handleGameStart);
    return () => {
      gameSocket.off("game-start", handleGameStart);
    };
  }
    , []);
  return (
    <Card className=" fixed z-10 flex  flex-col  rounded-lg bg-[#ffffff33] text-black shadow-2xl ">
      {/* First Part */}
      <div className="m-8 flex h-full sm:flex-row justify-between flex-col sm:space-x-24 space-y-6 ">
        <div className=" flex flex-col justify-center ">
          <Image
            src={state.user?.avatar.path ?? "/smazouz.jpeg"}
            alt={state.user?.login ?? ""}
            className="mx-auto rounded-full w-24 h-24 sm:w-32 sm:h-32"
            width={140}
            height={140}
          />
          <h2 className="mt-4 text-center text-xl font-semibold">
            {state.user?.login}
          </h2>
          <p className="text-center text-gray-500">{"zobi"}</p>
        </div>
        <div className=" flex  flex-col ">
          <div className=" flex h-full items-end justify-center">
            <div className="flec-co flex animate-bounce">
              <span className="mx-1 sm:text-6xl text-5xl font-bold">V</span>
              <span className="animate-pulse sm:text-7xl text-6xl font-bold text-blue-500">
                S
              </span>
            </div>
          </div>
          <div className="pt-5 h-full w-full items-center justify-center sm:block hidden ">
            <Button
              className="sm:h-[35px] sm:w-[130px] rounded-full  sm:text-2xl text-xl "
              onClick={() => {
                if (selectedOption === "Normal game")
                  gameSocket.emit("leave-queue", { user: state.user });
                else if (selectedOption === "Ranked game")
                  gameSocket.emit("leave-ranked-queue", { user: state.user });
                setIsPopupOpen(false);
                gameSocket.emit("busy");
              }}
            >
              cancel
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center  justify-center ">
          <div className="mx-auto sm:h-32 sm:w-32 h-20 w-20 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
          <p className="mt-4 text-center font-semibold ">
            Waiting for opponent...
          </p>
        </div>
        <div className=" flex flex-col justify-center  items-center sm:hidden">
          <Button
            className=" flex  rounded-full w-[90px] h-[30px] sm:text-2xl text-xl  items-center justify-center "
            onClick={() => {
              if (selectedOption === "Normal game")
                gameSocket.emit("leave-queue", { user: state.user });
              else if (selectedOption === "Ranked game")
                gameSocket.emit("leave-ranked-queue", { user: state.user });
              setIsPopupOpen(false);
            }}
          >
            cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};
export default PopUp;
