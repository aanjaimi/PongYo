import type { Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import React, { useState } from 'react';

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
  const [bool, setBool] = useState<boolean>(false);

  return (
    <div className="flex grow flex-col">
      <div className="flex justify-end">
        <button
          className="m-[1rem] flex h-6 w-6 items-center justify-center rounded-br-[10px] rounded-tl-[10px] bg-[#abd9d9b3]"
          onClick={() => setShowSettings(false)}
        >
          x
        </button>
      </div>
    </div>
  );
}
