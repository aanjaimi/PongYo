import React, { useState, useEffect, use } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocket } from "@/contexts/socket-context";
import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router";

type InvitedButtonProps = {
  setInviteNotify: (value: boolean) => void;
  setFriend: (value: string) => void;
};

const InvitedButton = ({ setInviteNotify, setFriend }: InvitedButtonProps) => {
  const { gameSocket } = useSocket();
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { query } = router;
  const handleInviteClick = (propUserName: string) => {
    if (propUserName) {
      setFriend(propUserName);
      gameSocket.emit("invite", { opponent: propUserName });
      return;
    }
    setFriend(username);
    gameSocket.emit("invite", { opponent: username });
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  useEffect(() => {
    const handleInviteClick = (propUserName: string) => {
      if (propUserName) {
        setFriend(propUserName);
        gameSocket.emit("invite", { opponent: propUserName });
        return;
      }
      setFriend(username);
      gameSocket.emit("invite", { opponent: username });
    };
    if (query.username && !query.startGame && !username) {
      setUsername(query.username as string);
      router.replace({
        pathname: router.pathname,
        query: {},
      }).catch((err) => console.error(err));
      handleInviteClick(query.username as string);
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
    const invitedSuccessHandler = () => {

      setInviteNotify(true);
      gameSocket.emit("readyToPlay");

    };
    const invitedFailHandler = (data: { msg: string }) => {
      notifyError(data.msg);
    };

    gameSocket.on("invited-success", invitedSuccessHandler);
    gameSocket.on("invited-fail", invitedFailHandler);
    return () => {
      gameSocket.off("invited-success", invitedSuccessHandler);
      gameSocket.off("invited-fail", invitedFailHandler);
    };
  }, [gameSocket, query, router, setFriend, setInviteNotify,username]);

  const notifyError = (message: string) => {
    toast.error(message, {
      position: "top-left",
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
        onClick={() => handleInviteClick(username)}
      >
        Invite
      </Button>
    </div>
  );
};
export default InvitedButton;