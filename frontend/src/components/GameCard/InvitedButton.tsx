import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocket } from "@/contexts/socket-context";
import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input"
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button"
type InvitedButtonProps = {
  setInviteNotify: (value: boolean) => void;
  setFriend: (value: User) => void
};
const InvitedButton = ({setInviteNotify,setFriend }:InvitedButtonProps) => {
  // State
  const { gameSocket } = useSocket();
  const [username, setUsername] = useState("");

  // Handle Invite Click
  const handleInviteClick = () => {
    setInviteNotify(true);
    gameSocket.emit("invite", { opponent : username });
  };

  // Handle Input Change
  const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  useEffect(() => {
    const invitedSuccessHandler = (data:{opp:User}) => {
      setFriend(data.opp);
      setInviteNotify(true);
    };

    const invitedHandler = (data:{msg:string, friend:string}) => {
      inviteNotify(data);
    };

    const invitedFailHandler = (data:{msg:string}) => {
      notifyError(data.msg);
    };

    gameSocket.on("invited-success", invitedSuccessHandler);
    gameSocket.on("invited-fail", invitedFailHandler);
    gameSocket.on("invited", invitedHandler);

    return () => {
      gameSocket.off("invited-success", invitedSuccessHandler);
      gameSocket.off("invited-fail", invitedFailHandler);
      gameSocket.off("invited", invitedHandler);
    };
  }, [gameSocket]);

  const inviteNotify = (data:{msg:string, friend:string}) => {
    toast(data.msg, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      onClick: () => {
        gameSocket.emit("acceptInvite", { opponent : data.friend});
      },
    });
  };

  // Notify Success
  const notifySuccess = (message:string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  // Notify Error
  const notifyError = (message:string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <div className="relative mx-auto flex w-[70%]">
      <Input
        type="text"
        placeholder="Enter username"
        className="h-10 w-[100%] rounded-full pl-4 focus:outline-none text-black text-xl"
        value={username}
        onChange={handleInputChange}
        maxLength={23}
      />
      <Button
        className="absolute right-0 h-10 w-[30%] rounded-full  text-white"
        onClick={handleInviteClick}
      >
        Invite
      </Button>
      <ToastContainer />
    </div>
  );
};

export default InvitedButton;