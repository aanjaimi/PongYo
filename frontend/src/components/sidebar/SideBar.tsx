import {
  MessageSquare,
  User,
  Gamepad2,
  Contact2,
  Settings,
} from "lucide-react";
import Link from "next/link";

import React from "react";

const SideBar = () => {
  return (
    <div className="flex h-full w-16 grow flex-col items-center justify-between gap-16 border border-r p-4">
      <div className="flex flex-col gap-16 p-4">
        <Link href="/profile/@me">
          <User className="sm:block hidden"/>
        </Link>
        <Link href="/game">
          <Gamepad2 className="sm:block hidden"/>
        </Link>
        <Link href="/friends">
          <Contact2 className="sm:block hidden"/>
        </Link>
        <Link href="/chat">
          <MessageSquare className="sm:block hidden"/>
        </Link>
      </div>
      <div className="flex">
        <Link href="/settings">
          <Settings className="sm:block hidden"/>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
