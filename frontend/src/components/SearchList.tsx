import React, { useState } from 'react'
import Image from 'next/image'
import type { User } from '@/types/user';

interface SearchListProps {
  users: User[];
}

const SearchList = (props: SearchListProps) => {

  const users = props.users;

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLLIElement;
    const user = users.find((user) => user.login == target.innerText);
    if (user) {
      window.location.href = "/profile/" + user.id;
    }
  }

  const handleMouseOver = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLLIElement;
    target.style.backgroundColor = "#2A3A6B";
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLLIElement;
    target.style.backgroundColor = "#33437D";
  }

  return (
    <div className="flex">
      <ul className="absolute flex flex-col bg-[#33437D] w-[300px] sm:w-[400px] mt-[25px] mb-[10px]">
        {users.map((user) => {
          return (
          <li key={user.id} className="flex my-[5px] ml-[10px]" onClick={handleClick} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
            <Image src={"/avatar.png"} alt="image" width={25} height={25}></Image>
            <p className="flex items-center ml-[10px]">{user.login}</p>
          </li>
        )})}
      </ul>
    </div>
  )
}

export default SearchList;
