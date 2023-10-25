import { useEffect, useState } from "react";
import Image from "next/image";
import { useStateContext } from "@/contexts/state-context";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import ProfileCompletion from "./ProfileCompletion";

type ProfileCoverProps = {
  isEdited: boolean;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
};

const ProfileCover = ({ user, isEdited, setIsEdited }: ProfileCoverProps) => {
  const { state } = useStateContext();
  const [on, setOn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setIsOwner(state.user?.id === user.id);
  }, [state.user?.id, user.id]);

  return (
    <>
      {isEdited && (
        <div className="relative mb-[19px] mt-[36px] flex flex-col items-center justify-center">
          {/* Cover  */}
          <div className="h-[100px] w-[400px] rounded-t-2xl md:h-[150px] md:w-[600px] lg:h-[242px] lg:w-[968px]">
            <Image
              className="rounded-t-2xl"
              src={"/cover.png"}
              alt="API Image"
              width={968}
              height={242}
            />
          </div>
          <div className="h-[120px] w-[400px] rounded-b-2xl border sm:h-[120px] md:h-[78px] md:w-[600px] lg:w-[968px]">
            <div className="mt-[50px] flex justify-between font-semibold text-black sm:mx-[5px] sm:mt-[50px] md:ml-[180px] md:mt-[10px]">
              <div className="ml-[20px] flex grow flex-col md:ml-[2px]">
                <span className="text-[20px] text-black">
                  {state.user?.displayname}
                </span>
                <span className="text-[20px] text-[#A5A3A3]">
                  @{state.user?.login}
                </span>
              </div>
              {!isOwner && (
                <div className="mr-[10px] flex justify-around">
                  <div className="ml-[15px] flex items-center">
                    <Button className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]">
                      Add friend
                    </Button>
                  </div>
                  <div className="ml-[15px] flex items-center">
                    <Button className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]">
                      Block
                    </Button>
                  </div>
                </div>
              )}
              {isOwner && (
                <div className="mr-[20px] flex items-center">
                  <Button
                    className="w-[130px] bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]"
                    onClick={() => setOn(true)}
                  >
                    Edit profile{on && <ProfileCompletion setOn={setOn} setIsEdited={setIsEdited} inProfileEdit={true} /*profileEdit={profileEdit} setProfileEdit={setProfileEdit}*//>}
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* Avatar */}
          <div className="bottom-50 left-50 absolute md:bottom-10 md:left-20">
            <Image
              className="rounded-full"
              src={user.avatar.path}
              alt="API Image"
              width={90}
              height={90}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCover;
