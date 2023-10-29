import React, { useEffect } from "react";
import NavBar from "./navbar/NavBar";
import SideBar from "./sidebar/SideBar";
import { useStateContext } from "@/contexts/state-context";
import Otp from "./Otp";
import { useSocket } from "@/contexts/socket-context";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const {
    state: { auth_status },
  } = useStateContext();

  const { notifSocket, chatSocket, gameSocket } = useSocket();

  useEffect(() => {
    if (auth_status === 'authenticated') {
      // to avoid re-connect !
      if (!notifSocket.connected) notifSocket.connect();
      if (!chatSocket.connected) chatSocket.connect();
      if (!gameSocket.connected) gameSocket.connect();
    }
  }, [auth_status, notifSocket, chatSocket, gameSocket]);




  if (auth_status === "otp")
    return (
      <div className="flex h-screen w-screen">
        <Otp />
      </div>
    );

  if (auth_status === 'authenticated')
    return (
      <div className="flex h-screen w-screen flex-col">
        <NavBar />
        <div className="flex h-full w-full">
          <SideBar />
          <div className="h-full w-full z-[-1]">{children}</div>
        </div>
      </div>
    );

  return <div className="flex h-screen w-screen">{children}</div>;
}
