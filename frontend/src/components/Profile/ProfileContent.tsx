import React, { useState } from "react";
import UserInfo from "./UserInfo";
import UserData from "./UserData";
import { type User } from "@/types/user";
import ProfileEdit from "./ProfileEdit";
import ProfileCover from "./ProfileCover";

type ProfileContentProps = {
  user: User;
};
const ProfileContent = ({ user }: ProfileContentProps) => {
  const [profileEditOn, setProfileEditOn] = useState(false);
  return (
    <div className="flex grow flex-col items-center justify-start">
      <ProfileCover user={user} />
      <UserData user={user} />
      <UserInfo user={user} />
      <ProfileEdit state={profileEditOn} setState={setProfileEditOn} />
    </div>
  );
};

export default ProfileContent;
