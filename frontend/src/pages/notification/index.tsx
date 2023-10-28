import { Notifications } from "@/components/notification";
import { useSocket } from "@/contexts/socket-context";
import { use } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from "next/router"


import { useEffect } from "react";

export default function Notification() {


  const { gameSocket } = useSocket();
  const inviteNotify = (data: { msg: string, friend: string }) => {
    console.log(`data=> ${data.msg} ${data.friend}`)
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
        router.push({
          pathname: '/game',
          query: {
            username: data.friend,
            startGame : true,
          },
        }).catch(err => console.log(err))
      },
    });
  };
  useEffect(() => {
    gameSocket.on("invited", (data: { msg: string, friend: string }) => {
      console.log(data);
      inviteNotify({ msg: data.msg, friend: data.friend });
    });
    return () => {
      gameSocket.off("invited", inviteNotify);
    }
  }, []);

  return (
    <div className="relative flex items-start justify-start w-full h-full sm:ml-[calc(100vw-467px)] ml-[calc(100vw-203px)]">
      <Notifications />
      <ToastContainer />

    </div>
  );
}
