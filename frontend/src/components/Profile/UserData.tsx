import React from "react";
import { type User } from "@/types/user";

type UserDataProps = {
  isEdited: boolean;
  user: User;
};

const UserData = ({ user, isEdited }: UserDataProps) => {

  const vectories = user.stat?.vectories == null ? 0 : user.stat.vectories;
  const defeats = user.stat?.defeats == null ? 0 : user.stat.defeats;
  const points = user.stat?.points == null ? 0 : user.stat.points;

  return (
    <>
      {isEdited && (
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
