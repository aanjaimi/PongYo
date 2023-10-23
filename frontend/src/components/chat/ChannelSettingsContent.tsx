import type { Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import React from 'react';
import UserCard from './UserCard';
import OwnerCard from './OwnerCard';
import ModeratorCard from './ModeratorCard';
import { ScrollArea } from '../ui/scroll-area';

interface ChannelSettingsContentProps {
  channel: Channel;
  user: User;
}

export default function ChannelSettingsContent({
  channel,
  user,
}: ChannelSettingsContentProps) {
  console.log(channel);
  const isModerator = () => {
    return channel.moderators.some((moderator) => moderator.id === user.id);
  };

  const isOwner = () => {
    return channel.ownerId === user.id;
  };

  return (
    <ScrollArea className="flex flex-col">
      <div className="grown my-[0.5rem] flex items-center px-[5rem]">
        <h2>Owner</h2>
        <div className="mx-[1rem] h-[0] grow rounded-full border"></div>
      </div>
      <OwnerCard user={channel.owner} />
      {channel.moderators.length > 0 && (
        <div className="grown my-[0.5rem] flex items-center px-[5rem]">
          <h2>Moderators</h2>
          <div className="mx-[1rem] h-[0] grow rounded-full border"></div>
        </div>
      )}
      {channel.moderators.map((moderator) => (
        <ModeratorCard
          key={moderator.id}
          channel={channel}
          isOwner={isOwner}
          cardUser={moderator}
          user={user}
        />
      ))}
      <div className="grown my-[0.5rem] flex items-center px-[5rem]">
        <h2>Users</h2>
        <div className="mx-[1rem] h-[0] grow rounded-full border"></div>
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
