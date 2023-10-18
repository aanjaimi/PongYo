import React, { useEffect } from "react";
import { useStateContext } from "@/contexts/state-context";
import {
  CircularProgress,
  Card,
  CardBody,
  CardFooter,
  Chip,
} from "@nextui-org/react";

const UserData = () => {
  const { state } = useStateContext();

  const vectories = state.user?.vectories == null ? 0 : state.user.vectories;
  const defeats = state.user?.defeats == null ? 0 : state.user.defeats;
  const points = state.user?.points == null ? 0 : state.user.points;

  const winRatio =
    vectories + defeats == 0 ? 0 : (vectories / (vectories + defeats)) * 100;

  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < winRatio) {
        setProgress(progress + 1);
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  return (
    <div className="h-[100px] w-[400px] rounded-2xl md:h-[150px] md:w-[600px] lg:h-[242px] lg:w-[968px] bg-[#33437D] flex justify-between">
      <div className="hidden md:block text-white font-semibold text-3xl flex items-center justify-center lg:mt-[50px]">
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            indicator: "stroke-green",
            track: "stroke-red-500/100",
            value:
              "text-3xl font-semibold text-white relative -top-[90px] flex items-center justify-center",
          }}
          size="lg"
          value={winRatio}
          showValueLabel={true}
        />
      </div>
      <div className="block md:hidden flex justify-around items-center text-white md:text-2xl font-semibold ml-[10px]">
        <div className="flex flex-col items-center"><p>winRatio</p><p>{winRatio.toFixed(0)}%</p></div>
      </div>
      <div className="grow flex justify-around items-center text-white md:text-2xl font-semibold">
        <div className="flex flex-col items-center"><p>vectories</p><p>{vectories}</p></div>
        <div className="flex flex-col items-center"><p>defeats</p><p>{defeats}</p></div>
        <div className="flex flex-col items-center"><p>points</p><p>{points}</p></div>
      </div>
    </div>
  );
};

export default UserData;
