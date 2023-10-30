import type { Channel } from '@/types/channel';
import type { User } from '@/types/user';
import React from 'react';
import Image from 'next/image';
import ChannelSettingsContent from './ChannelSettingsContent';
import EditChannel from './EditChannel';
import LeaveChannel from './LeaveChannel';
import Moderator from './Moderator';
import ChangeOwnership from './ChangeOwnership';

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
              <ChangeOwnership channel={channel} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
