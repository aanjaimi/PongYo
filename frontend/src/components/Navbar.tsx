import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";
import SearchList from "./SearchList";
import { useStateContext } from "@/contexts/state-context";

const Navbar = () => {

  const { state } = useStateContext();
  const [users, setUsers] = useState<User[] | []>([]);

  const getUsers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUsers([]);
    const target = "/users/search?value=" + e.target.value;
    const resp = await fetcher.get<User[] | []>(target);
    setUsers(resp.data);
  };

  return (
    <div className="z-20 flex h-[50px] w-screen justify-between bg-[#33437D]">
      <div className="flex items-center justify-start border-r border-black">
        <Link href="/profile/@me">
          <Image src={"/profile_logo.png"} alt="image" width={74} height={50} />
        </Link>
      </div>
      <div className="flex mb-[12px] mt-[12px] h-[30px] w-[300px] items-center justify-start rounded-md border border-black sm:w-[400px]">
        {users.length != 0 && <SearchList users={users} />}
        <div className="ml-[5px]">
          <Image src={"/search.png"} alt="image" width={25} height={25} />
        </div>
        <input
          className="ml-[10px] h-[25px] w-[300px] rounded-2xl bg-[#33437D] text-white focus:border-none focus:outline-none sm:w-[400px]"
          placeholder="search..."
          onChange={getUsers}
        >
        </input>
      </div>
      <div className="mr-[12px] flex items-center justify-start">
        <Image
          src={"/notifications_off.png"}
          alt="image"
          width={22}
          height={22}
        />
      </div>
    </div>
  );
};

export default Navbar;
