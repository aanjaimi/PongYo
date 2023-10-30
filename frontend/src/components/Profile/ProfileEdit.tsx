import React from "react";
import ProfileCompletion from "./ProfileCompletion";
import { useStateContext } from "@/contexts/state-context";
import type { User } from "@/types/user";

type ProfileEditProps = {
  user: User;
  isEdited: boolean;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileEdit = ({ user, isEdited, setIsEdited }: ProfileEditProps) => {
  const { state } = useStateContext();
  const isOwner = state.user?.id === user.id;

  return (
    <>
      {isOwner && !isEdited && (
        <div className="flex h-full w-full items-center justify-center">
          <ProfileCompletion setIsEdited={setIsEdited} />
        </div>
      )}
    </>
  );
};

export default ProfileEdit;
