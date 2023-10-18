import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocket } from "@/contexts/socket-context";
import type { ChangeEvent } from "react";

const InvitedButton = () => {
  // State
  const { gameSocket } = useSocket();
  const [username, setUsername] = useState("");

  // Handle Invite Click
  const handleInviteClick = () => {
    console.log("event 1");
    gameSocket.emit("invite", { username });
  };

  // Handle Input Change
  const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  useEffect(() => {
    const invitedSuccessHandler = (data:{msg:string}) => {
      console.log(data);
      notifySuccess(data.msg);
    };

    const invitedHandler = (data:{msg:string, friend:string}) => {
      console.log(data);
      inviteNotify(data);
    };

    const invitedFailHandler = (data:{msg:string}) => {
      console.log(data);
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
        console.log("Toast clicked!");
        gameSocket.emit("acceptInvite", { friend : data.friend});
        // setGameStarted(true);
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
      <input
        type="text"
        placeholder="Enter username"
        className="h-10 w-[100%] rounded-full bg-gray-500 pl-4 focus:outline-none"
        value={username}
        onChange={handleInputChange}
        maxLength={22}
      />
      <button
        className="absolute right-0 h-10 w-[30%] rounded-full bg-blue-500 text-white"
        onClick={handleInviteClick}
      >
        Invite
      </button>
      <ToastContainer />
    </div>
  );
};

export default InvitedButton;