import type { Channel } from '@/types/Channel';
import React from 'react';

interface channelInfoProps {
  channel: Channel | undefined;
  updateSelectedChannel: (arg: Channel | undefined) => void;
  setShowSettings: (arg: boolean) => void;
}

export default function ChannelInfo({
  channel,
  updateSelectedChannel,
  setShowSettings,
}: channelInfoProps) {
  return (
    <div className="flex justify-between h-[7%] items-center justify-center">
      {channel && (
        <>
          <button
            className="ml-[1rem] flex h-6 w-6 items-center justify-center rounded-bl-[10px] rounded-tr-[10px] bg-[#abd9d9b3] pb-2"
            onClick={() => setShowSettings(true)}
          >
            ...
          </button>
          <div className="flex items-center justify-center">
            <h1 className="text-3xl">{channel.name}</h1>
          </div>
          <button
            className="mr-[1rem] flex h-6 w-6 items-center justify-center rounded-br-[10px] rounded-tl-[10px] bg-[#abd9d9b3]"
            onClick={() => updateSelectedChannel(undefined)}
          >
            x
          </button>
        </>
      )}
    </div>
  );
}
