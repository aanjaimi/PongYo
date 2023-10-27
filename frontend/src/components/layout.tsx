import React from "react";
import NavBar from "./navbar/NavBar";
import SideBar from "./sidebar/SideBar";
import { useStateContext } from "@/contexts/state-context";
import Otp from "./Otp";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const {
    state: { authenicated },
  } = useStateContext();
  return (
    <div className="flex flex-col w-screen h-screen">
      {authenicated === true && (
        <div className="flex h-full w-full flex-col">
          <NavBar />
          <div className="flex h-full w-full">
            <SideBar />
            <div className="h-full w-full">{children}</div>
          </div>
        </div>
      )}
      {authenicated === false && <>{children}</>}
      {authenicated === "otp" && <Otp />}
    </div>
  );
}