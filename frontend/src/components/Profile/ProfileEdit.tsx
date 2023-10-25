import React, { useState } from "react";
import ProfileCompletion from "./ProfileCompletion";

type ProfileEditProps = {
  isEdited: boolean;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileEdit = ({ isEdited, setIsEdited }: ProfileEditProps) => {
  const [, setOn] = useState(true);

  return (
    <>
      {!isEdited && (
        <div className="flex h-screen w-screen items-center justify-center">
          <ProfileCompletion setOn={setOn} inProfileEdit={false} setIsEdited={setIsEdited} />
        </div>
      )}
    </>
  );
};

export default ProfileEdit;
