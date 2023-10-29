import type { Channel } from '@/types/channel';
import React from 'react';
import Image from 'next/image';
import Redirect from './RedirectToProfile';
import type { User } from '@/types/user';

interface channelInfoProps {
  user: User;
  channel: Channel | undefined;
  updateSelectedChannel: (arg: Channel | undefined) => void;
  setShowSettings: (arg: boolean) => void;
}

export default function ChannelInfo({
  user,
  channel,
  updateSelectedChannel,
  setShowSettings,
}: channelInfoProps) {
  return (
    <div className="flex h-[7%] items-center justify-between">
      {channel && (
        <>
          <div>
            {channel.isDM ? (
              <Redirect user={user} channel={channel} />
            ) : (
              <button
                className="ml-[1rem] w-[2rem]"
                onClick={() => setShowSettings(true)}
              >
                <Image src={'/dots.png'} alt="close" height={100} width={100} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-center">
            <h1 className="text-3xl">{channel.name}</h1>
          </div>
          <button
            className="mr-[1rem] w-[1.8rem]"
            onClick={() => updateSelectedChannel(undefined)}
          >
            <Image src={'/close.png'} alt="close" height={100} width={100} />
          </button>
        </>
      )}
    </div>
  );
}
