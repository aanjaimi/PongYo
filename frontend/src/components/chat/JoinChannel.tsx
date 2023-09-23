import { Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import axios from 'axios';
import React from 'react'

export default function JoinChannel(
  {
    userName,
    setUserName,
    joinChannelName,
    setJoinChannelName,
    joinChannelPassword,
    setJoinChannelPassword,
  } :
  {
    userName : string,
    setUserName : (arg : string) => void,
    joinChannelName : string,
    setJoinChannelName : (arg : string) => void,
    joinChannelPassword : string,
    setJoinChannelPassword : (arg : string) => void,
  }
) {

  const joinDirectMessage = (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(userName)
    // const { data } : { data : Channel } = await axios.post("http://localhost:5000/chat/directMessage$userName=1", {
    //   userName,
    // });
    // updateChannels([...channels, data as Channel]);
    // updateSelectedChannel(data as Channel);
  }

  // todo finish the join channel component

  return (
    <div className="flex flex-col items-end self-end mr-[35%] text-[18px] my-[1rem]">
      <div className="flex my-[2rem]">
        <div className="text-xl">Direct message:</div>
        <form
          className="flex w-[13rem] ml-6 rounded-full bg-white"
          onSubmit={(e) => joinDirectMessage(e)}
        >
          <input
            type="text"
            placeholder='username...'
            className="text-black px-4 rounded-full w-[75%] focus:outline-none"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button className="flex justify-center items-center w-[25%] bg-[#2C9FE6] rounded-full">Start</button>
        </form>
      </div>
      <div className="flex my-[2rem]">
        <div className="text-xl">Join a channel:</div>
        <form className="flex w-[13rem] ml-6 rounded-full bg-white">
          <input
            type="text"
            placeholder='channel name...'
            className="text-black px-4 rounded-full w-[75%] focus:outline-none"
          />
          <button className="flex justify-center items-center w-[25%] bg-[#2C9FE6] rounded-full">Join</button>
        </form>
      </div>
    </div>
  )
}
