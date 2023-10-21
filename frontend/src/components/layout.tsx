import React from "react";
import { Sidebar } from "./sidebar";
import NavBar from "./navbar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex h-screen w-screen flex-col">
        <NavBar />
        <div className="flex h-full w-full">
          <div className="">
            <Sidebar />
          </div>
          <div className="flex-1 overflow-hidden p-4">{children}</div>
        </div>
      </div>
    </>
  );
}
