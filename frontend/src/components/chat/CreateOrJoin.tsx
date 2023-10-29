import React from 'react';
import type { Channel } from '@/types/channel';
import JoinChannel from './JoinChannel';
import type { User } from '@/types/user';
import CreateChannel from './CreateChannel';
import type { FriendShip } from '@/types/friend';

interface CreateOrJoinProps {
  user: User;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  updateSelectedChannel: (arg: Channel | undefined) => void;
  blocks: FriendShip[];
}

export default function CreateOrJoin({
  user,
  channels,
  updateChannels,
  updateSelectedChannel,
  blocks,
}: CreateOrJoinProps) {
  return (
    <div className="flex grow flex-col">
      <div className="h-[7%]"></div>
      {/* Seperator */}
      <div className="mr-1 rounded-l-full border border-black"></div>
      <div className="flex grow flex-col items-center">
        <div className="my-[2rem] text-[40px]">
          Join or create a channel room
        </div>
        {/* join channel */}
        <JoinChannel
          user={user}
          channels={channels}
          updateChannels={updateChannels}
          updateSelectedChannel={updateSelectedChannel}
          blocks={blocks}
        />
        {/* Or Seperator */}
        <div className="my-[2rem] flex w-full items-center">
          <div className="ml-[1rem] h-[0] w-[45%] rounded-full border border-black"></div>
          <div className="flex w-[10%] items-center justify-center text-3xl">
            or
          </div>
          <div className="mr-[1rem] h-[0] w-[45%] rounded-full border border-black"></div>
        </div>
        {/* create channel */}
        <CreateChannel
          user={user}
          channels={channels}
          updateChannels={updateChannels}
          updateSelectedChannel={updateSelectedChannel}
        />
      </div>
    </div>
  );
}
