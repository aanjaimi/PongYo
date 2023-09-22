import React from "react";

const InvitedButton = ({ onInviteClick }) => {
  
  return (
    <div className="relative w-[70%] flex mx-auto">
      <input
        type="text"
        placeholder="username"
        className="w-[100%] h-10 rounded-full bg-gray-500"
      />
      <button
        className="w-[30%] h-10 absolute right-0 rounded-full bg-blue-500 text-white"
        onClick={onInviteClick}
      >
        Invite
      </button>
    </div>
  );
};

export default InvitedButton;