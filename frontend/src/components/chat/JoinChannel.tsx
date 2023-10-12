import type { Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import axios from 'axios';
import React, { useState } from 'react'

export default function JoinChannel(
  {
    user,
    channels,
    updateChannels,
    updateSelectedChannel,
  } : 
  {
    user: User,
    channels: Channel[],
    updateChannels: (arg : Channel[]) => void,
    updateSelectedChannel:  (arg : Channel | undefined) => void,
  }
) {
  const [displayName, setdisplayName] = useState<string>("");
  const [joinChannelName, setJoinChannelName] = useState<string>("");
  const [joinChannelPassword, setJoinChannelPassword] = useState<string>("");

  const joinDirectMessage = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let channel: Channel | undefined = channels.find((channel) => channel.name === displayName);
    if (channel && channel.isDM) {
      updateSelectedChannel(channel);
      return;
    } else if (channel) return;

    try {
      const { data } : { data: Channel } = await axios.get(`http://localhost:5010/chat/directMessage?displayName=${displayName}`, {
        withCredentials: true,
      });
      channel = data;
    } catch(err) {
      console.log(err);
    } finally {
      if (!channel) return;

      const name: string[] = channel.name.split('-');
      channel.name = (name[0] === user.displayName ? name[1] : name[0]) as unknown as string;

      updateChannels([channel, ...channels]);
      updateSelectedChannel(channel);
    }
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
            className="text-black px-4 rounded-full w-[75%] focus:outline-none bg-[#00000000]"
            value={displayName}
            onChange={(e) => setdisplayName(e.target.value)}
          />
          <button className="flex justify-center items-center w-[25%] border bg-[#2C9FE6] rounded-full">Start</button>
        </form>
      </div>
      <div className="flex my-[2rem]">
        <div className="text-xl">Join a channel:</div>
        <form className="flex w-[13rem] ml-6 rounded-full bg-white">
          <input
            type="text"
            placeholder='channel name...'
            className="text-black px-4 rounded-full w-[75%] focus:outline-none bg-[#00000000]"
          />
          <button className="flex justify-center items-center w-[25%] border bg-[#2C9FE6] rounded-full">Join</button>
        </form>
      </div>
    </div>
  )
}
