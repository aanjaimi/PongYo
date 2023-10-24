import Search from "../search";
import { Bell, Rocket } from "lucide-react";
import Link from "next/link";

import React from "react";

const NavBar = () => {
  return (
    <div className="flex h-16 items-center justify-between border-b p-4">
      <Link href="/profile/@me">
        <Rocket />
      </Link>
      <Search />
      <Link href="/notification">
        <Bell />
      </Link>
    </div>
  );
};

export default NavBar;
