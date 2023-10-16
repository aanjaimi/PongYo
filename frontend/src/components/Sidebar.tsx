import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { Buttons } from '../types/common'
import { ALLbuttons } from '../types/common'
import { useState, useEffect } from 'react';

interface SideBarProps {
  button: Buttons;
}

const Sidebar = (props: SideBarProps) => {
  const [profile, setProfile] = useState(false);
  const [game, setGame] = useState(false);
  const [friends, setFriends] = useState(false);
  const [chat, setChat] = useState(false);
  const [param, setParam] = useState(false);

    useEffect(() => {
      if (props.button == Buttons.PROFILE)
        setProfile(true);
      else if (props.button == Buttons.GAME)
        setGame(true);
      else if (props.button == Buttons.FRIENDS)
        setFriends(true);
      else if (props.button == Buttons.CHAT)
        setChat(true);
      else if (props.button == Buttons.PARAM)
        setParam(true);
    }, [props]);

  return (
    <div className="sm:block hidden">
      <div className="side border-r border-black w-[75px] h-[100%] bg-[#000355] sm:bg-[#33437D] z-10 flex flex-col justify-between overflow-auto">
        <div className="sm:bg-[#33437D] sm:block hidden">
          <div className="flex justify-center mb-[50px] mt-[20px]">
            <Link href="/profile">
              <Image className="sm:block hidden" src={profile == true ? ALLbuttons.PROFILE_ON : ALLbuttons.PROFILE_OFF} alt="image" width={30} height={30}/>
            </Link>
          </div>
          <div className="flex justify-center mb-[50px] mt-[20px]">
            <Link href="/game">
              <Image className="sm:block hidden" src={game == true ? ALLbuttons.GAME_ON : ALLbuttons.GAME_OFF} alt="image" width={37} height={37}/>
            </Link>
          </div>
          <div className="flex justify-center mb-[50px] mt-[20px]">
            <Link href="/friends">
              <Image className="sm:block hidden" src={friends == true ? ALLbuttons.FRIENDS_ON : ALLbuttons.FRIENDS_OFF} alt="image" width={26} height={26}/>
            </Link>
          </div>
          <div className="flex justify-center mb-[50px] mt-[20px]">
            <Link href="/chat">
              <Image className="sm:block hidden" src={chat == true ? ALLbuttons.CHAT_ON : ALLbuttons.CHAT_OFF} alt="image" width={29} height={29}/>
            </Link>
          </div>
        </div>
        <div className="flex justify-center mb-[30px] bg-[#33437D]">
          <div className="sm:block hidden">
            <Link href="/settings">
              <Image src={param == true ? ALLbuttons.PARAM_ON : ALLbuttons.PARAM_OFF} alt="image" width={32} height={32}/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;
