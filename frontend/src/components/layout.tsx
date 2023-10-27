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

  const { socket, chatSocket, gameSocket } = useSocket();

  useEffect(() => {
    if (auth_status === true) {
      // to avoid re-connect !
      if (!socket.connected) socket.connect();
      if (!chatSocket.connected) chatSocket.connect();
      if (!gameSocket.connected) gameSocket.connect();
    }
  }, [auth_status, socket, chatSocket, gameSocket]);

  if (auth_status === "loading")
    return (
      <div className="flex h-screen w-screen">
        TODO: Add Loading Component...
      </div>
    );

  if (auth_status === "otp")
    return (
      <div className="flex h-screen w-screen">
        <Otp />
      </div>
    );

  if (auth_status === true)
    return (
      <div className="flex h-screen w-screen flex-col">
        <NavBar />
        <div className="flex h-full w-full">
          <SideBar />
          <div className="h-full w-full">{children}</div>
        </div>
      </div>
    );

  return <div className="flex h-screen w-screen">{children}</div>;
}
