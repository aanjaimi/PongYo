import React from "react";
import ProfileCompletion from "./ProfileCompletion";


type ProfileEditProps = {
  isEdited: boolean;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileEdit = ({ isEdited, setIsEdited }: ProfileEditProps) => {

  return (
    <>
      {!isEdited && (
        <div className="flex h-full w-full items-center justify-center">
          <ProfileCompletion setIsEdited={setIsEdited} />
        </div>
      )}
    </>
  );
};

export default ProfileEdit;
