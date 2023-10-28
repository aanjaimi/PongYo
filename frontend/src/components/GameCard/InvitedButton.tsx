import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocket } from "@/contexts/socket-context";
import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input"
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";
import { set } from "zod";
type InvitedButtonProps = {
  setInviteNotify: (value: boolean) => void;
  setFriend: (value: string) => void;
};

const InvitedButton = ({ setInviteNotify, setFriend }: InvitedButtonProps) => {
  // State
  const { gameSocket } = useSocket();
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { query } = router;
  // Handle Invite Click
  const handleInviteClick = (propUserName: string) => {
    // setInviteNotify(true);
    if (propUserName) {
      setFriend(propUserName);
      gameSocket.emit("invite", { opponent: propUserName });
      return;
    }
    setFriend(username);
    gameSocket.emit("invite", { opponent: username });
  };
  // Handle Input Change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  useEffect(() => {
    if (query.username && !query.startGame) {
      setFriend(query.username as string);
      setUsername(query.username as string);
      handleInviteClick(query.username as string);
      router.replace({
        pathname: router.pathname,
        query: {},
      }).catch((err) => console.error(err));
      console.log("i'm here\n");
    }
    if(query.startGame && query.username){
      setFriend(query.username as string);
      setInviteNotify(true);
      gameSocket.emit("readyToPlay");
      router.replace({
        pathname: router.pathname,
        query: {},
      }).catch((err) => console.error(err));
    }
    const invitedSuccessHandler = (data: { opp: User }) => {

      setInviteNotify(true);
      gameSocket.emit("readyToPlay");

    };
    const invitedHandler = (data: { msg: string, friend: string }) => {
      inviteNotify(data);
      setFriend(data.friend);
    };
    const invitedFailHandler = (data: { msg: string }) => {
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
  }, []);

  const inviteNotify = (data: { msg: string, friend: string }) => {
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
        gameSocket.emit("acceptInvite", { opponent: data.friend });
        setInviteNotify(true);
      },
    });
  };

  // Notify Success
  const notifySuccess = (message: string) => {
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
  const notifyError = (message: string) => {
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
        onClick={() => handleInviteClick()}
      >
        Invite
      </Button>
      <ToastContainer />
    </div>
  );
};

export default InvitedButton;