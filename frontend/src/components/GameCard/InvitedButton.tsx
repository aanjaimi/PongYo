import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Socket } from "socket.io-client";
import { stat } from "fs";
import { date } from "zod";
import { useSocket } from "@/contexts/socket-context";
import { useStateContext } from "@/contexts/game-context";

const InvitedButton = ({ setGameStarted }) => {
  // State
  const { state } = useStateContext();
  const { gameSocket } = useSocket();
  const [username, setUsername] = useState("");

  // Handle Invite Click
  const handleInviteClick = () => {
    console.log("event 1");
    gameSocket.emit('invite', { username: username });
  };

  // Handle Input Change
  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };


  useEffect(() => {
    const invitedSuccessHandler = (data) => {
      console.log(data);
      notifySuccess(data.msg);
    };
    const invitedHandler = (data) => {
      console.log(data);
      inviteNitify(data);
    }
    const invitedFailHandler = (data) => {
      console.log(data);
      notifyError(data.msg);
    };

    gameSocket.on('invitedSuccess', invitedSuccessHandler);
    gameSocket.on('invitedFail', invitedFailHandler);
    gameSocket.on('invited', invitedHandler);
    return () => {
      gameSocket.off('invitedSuccess', invitedSuccessHandler);
      gameSocket.off('invitedFail', invitedFailHandler);
      gameSocket.off('invited', invitedHandler);
      gameSocket.off('gameStarted');
    };
  }, []);
  const inviteNitify = (data) => {
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
        console.log('Toast clicked!'); // Replace this with your desired 
        gameSocket.emit('acceptInvite', { friend: data.friend });
        // setGameStarted(true);
      },
    });
  }
  // Notify Success
  const notifySuccess = (message) => {
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
  const notifyError = (message) => {
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
    <div className="relative w-[70%] flex mx-auto">
      <input
        type="text"
        placeholder="Enter username"
        className="w-[100%] h-10 rounded-full bg-gray-500 pl-4 focus:outline-none" // Add padding to the left using pl-2
        value={username}
        onChange={handleInputChange}
        maxLength={22}
      />
      <button
        className="w-[30%] h-10 absolute right-0 rounded-full bg-blue-500 text-white" // Add margin using m-1 and mr-4
        onClick={handleInviteClick}
      >
        Invite
      </button>
      <ToastContainer />
    </div>
  );
};

export default InvitedButton;