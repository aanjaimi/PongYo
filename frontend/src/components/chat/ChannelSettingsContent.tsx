import type { Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import React from 'react';
import UserCard from './UserCard';
import OwnerCard from './OwnerCard';
import { ScrollArea } from '../ui/scroll-area';

interface ChannelSettingsContentProps {
  channel: Channel;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  user: User;
}

export default function ChannelSettingsContent({
  channel,
  channels,
  updateChannels,
  user,
}: ChannelSettingsContentProps) {
  const isModerator = () => {
    return channel.moderators.some((moderator) => moderator.id === user.id);
  };

  const isOwner = () => {
    return channel.ownerId === user.id;
  };

  return (
    <ScrollArea className="grow flex flex-col">
      <div className="grown my-[0.5rem] flex items-center px-[5rem]">
        <h2>Owner</h2>
        <div className="mx-[1rem] h-[0] grow rounded-full border border-black"></div>
      </div>
      <OwnerCard user={channel.owner} />
      {channel.moderators.length > 0 && (
        <div className="grown my-[0.5rem] flex items-center px-[5rem]">
          <h2>Moderators</h2>
          <div className="mx-[1rem] h-[0] grow rounded-full border border-black"></div>
        </div>
      )}
      {channel.moderators.map((moderator) => (
        <UserCard
        key={moderator.id}
        channel={channel}
        channels={channels}
        updateChannels={updateChannels}
        isModerator={isModerator}
        isOwner={isOwner}
        cardUser={moderator}
        user={user}
        />
      ))}
      <div className="grown my-[0.5rem] flex items-center px-[5rem]">
        <h2>Users</h2>
        <div className="mx-[1rem] h-[0] grow rounded-full border border-black"></div>
      </div>
      {channel.members.map(
        (member) =>
          channel.owner.id !== member.id &&
          channel.moderators.every(
            (moderator) => moderator.id !== member.id,
          ) && (
            <UserCard
              key={member.id}
              channel={channel}
              channels={channels}
              updateChannels={updateChannels}
              isModerator={isModerator}
              isOwner={isOwner}
              cardUser={member}
              user={user}
            />
          ),
      )}
    </ScrollArea>
  );
}
