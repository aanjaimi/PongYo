import React, { useEffect } from "react";
import { useStateContext } from "@/contexts/state-context";
import { CircularProgress } from "@nextui-org/react";
import { type User } from "@/types/user";

type UserDataProps = {
  user: User;
};

const UserData = ({ user }: UserDataProps) => {
  const { state } = useStateContext();

  const vectories = state.user?.vectories == null ? 0 : state.user.vectories;
  const defeats = state.user?.defeats == null ? 0 : state.user.defeats;
  const points = state.user?.points == null ? 0 : state.user.points;

  return (
    <>
      {user.isCompleted && (
        <div className="border flex h-[80px] w-[400px] items-center justify-between rounded-2xl md:h-[150px] md:w-[600px] lg:h-[180px] lg:w-[968px]">
          <div className="ml-[10px] font-semibold text-black lg:text-xl">
          </div>
          <div className="flex grow items-center justify-around font-semibold text-black md:text-2xl">
            <div className="flex flex-col items-center">
              <p>vectories</p>
              <p>{vectories}</p>
            </div>
            <div className="flex flex-col items-center">
              <p>defeats</p>
              <p>{defeats}</p>
            </div>
            <div className="flex flex-col items-center">
              <p>points</p>
              <p>{points}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserData;
