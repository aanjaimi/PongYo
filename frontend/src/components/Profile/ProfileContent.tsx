import React from "react";
import UserInfo from "./UserInfo";
import UserData from "./UserData";
import { type User } from "@/types/user";
import ProfileEdit from "./ProfileEdit";
import ProfileCover from "./ProfileCover";

type ProfileContentProps = {
  user: User;
  isEdited: boolean;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
};
const ProfileContent = ({ user, isEdited, setIsEdited }: ProfileContentProps) => {
  return (
    <div className="flex w-full h-full flex-col items-center justify-start">
      <ProfileCover user={user} isEdited={isEdited} setIsEdited={setIsEdited}/>
      <UserData user={user} isEdited={isEdited}/>
      <UserInfo user={user} isEdited={isEdited}/>
      <ProfileEdit isEdited={isEdited} setIsEdited={setIsEdited} />
    </div>
  );
};

export default ProfileContent;
