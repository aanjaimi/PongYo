import {
  MessageSquare,
  User,
  Gamepad2,
  Contact2,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

import React from 'react';

const SideBar = () => {
  return (
    <div className="hidden h-full w-16 border sm:block">
      <div className="flex h-full w-16 flex-col items-center gap-16 border border-r p-4">
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
      </div>
    </div>
  );
};

export default SideBar;
