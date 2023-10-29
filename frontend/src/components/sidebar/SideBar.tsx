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
    <div className="border hidden sm:block w-16 h-full">
      <div className="w-16 h-full flex flex-col items-center justify-between gap-16 border border-r p-4">
        <div className="flex flex-col gap-16 p-4">
          <Link href="/profile/@me">
            <User className="hidden sm:block" />
          </Link>
          <Link href="/game">
            <Gamepad2 className="hidden sm:block" />
          </Link>
          <Link href="/friend">
            <Contact2 className="hidden sm:block" />
          </Link>
          <Link href="/chat">
            <MessageSquare className="hidden sm:block" />
          </Link>
        </div>
        <div className="flex">
          <Link href="/settings">
            <Settings className="hidden sm:block" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
