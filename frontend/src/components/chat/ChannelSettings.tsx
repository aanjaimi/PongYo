import type { Channel } from '@/types/channel';
import type { User } from '@/types/user';
import React, { useState } from 'react';
import Image from 'next/image';
// import axios from 'axios';
// import { env } from '@/env.mjs';
import ChannelSettingsContent from './ChannelSettingsContent';
import EditChannel from './EditChannel';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import LeaveChannel from './LeaveChannel';
import Moderator from './Moderator';

interface channelSettingsProps {
  channel: Channel;
  updateSelectedChannel: (arg: Channel | undefined) => void;
  user: User;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  setShowSettings: (arg: boolean) => void;
}

export default function ChannelSettings({
  channel,
  updateSelectedChannel,
  user,
  channels,
  updateChannels,
  setShowSettings,
}: channelSettingsProps) {
  // const url = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [userName, setUserName] = useState<string>('');

  const inviteUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // axios
    //   .post(`${url}/invitePath???`, {}, { withCredentials: true })
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((err) => console.log(err));
    setUserName('');
    e.currentTarget.reset();
  };

  return (
    <>
      <div className="flex grow flex-col">
        <div className="flex items-center justify-between">
          <div>
            {user.id === channel.ownerId && (
              <EditChannel
                channel={channel}
                user={user}
                channels={channels}
                updateChannels={updateChannels}
                updateSelectedChannel={updateSelectedChannel}
              />
            )}
          </div>
          <button
            className="m-[1rem] w-[1.8rem]"
            onClick={() => setShowSettings(false)}
          >
            <Image src={'/close.png'} alt="close" height={100} width={100} />
          </button>
        </div>
        <Image
          src="/avatar.png"
          alt="channelAvatar"
          width={75}
          height={75}
          className="my-[0.5rem] self-center"
        />
        <h1 className="my-[0.5rem] text-center text-2xl font-bold">
          {channel.name}
        </h1>
        {/* Separator */}
        <div className="mx-[2rem] my-[1rem] rounded-full border border-black"></div>
        <form
          className="my-[0.5rem] ml-6 flex self-center rounded-full bg-white"
          onSubmit={(e) => inviteUser(e)}
        >
          <Input
            type="text"
            placeholder="username..."
            className="mr-[1rem] w-[15rem] border-[2px] border-black"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button className="">invite</Button>
        </form>
        <ChannelSettingsContent
          channel={channel}
          channels={channels}
          updateChannels={updateChannels}
          user={user}
        />
        <div className="flex justify-between">
          <div>
            {user.id === channel.ownerId && <Moderator channel={channel} />}
          </div>
          <div>
            {channel.ownerId !== user.id ? (
              <LeaveChannel
                channel={channel}
                setShowSettings={setShowSettings}
              />
            ) : (
              <Button className="m-[1rem]">delete channel</Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
