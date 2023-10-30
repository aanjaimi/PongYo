import type { Channel } from '@/types/channel';
import React from 'react';
import Image from 'next/image';
import { Card } from '../ui/card';
import type { FriendShip } from '@/types/friend';
import type { User } from '@/types/user';

const displayLastMessage = (channel: Channel, blocks: FriendShip[]) => {
  if (channel.messages.length > 0) {
    const lastMessage = channel.messages[channel.messages.length - 1];
    if (lastMessage) {
      const hideMessage = blocks.some(
        (block) => block.id === lastMessage.userId,
      );
      if (hideMessage) return '**Hidden**';
      return `${lastMessage.user.displayname}: ${lastMessage.content}`;
    } else return '';
  } else {
    return '';
  }
};

export const displayString = (str: string, len: number) => {
  if (str.length > len) {
    return str.slice(0, len) + '…';
  } else {
    return str;
  }
};

interface ChannelsListProps {
  user: User;
  channels: Channel[];
  updateSelectedChannel: (arg: Channel | undefined) => void;
  selectedChannel: Channel | undefined;
  showSettings: boolean;
  setShowSettings: (arg: boolean) => void;
  blocks: FriendShip[];
}

export default function ChannelsList({
  user,
  channels,
  updateSelectedChannel,
  selectedChannel,
  setShowSettings,
  blocks,
}: ChannelsListProps) {
  const hideChannel = (channel: Channel) => {
    if (channel.isDM) {
      const otherUser =
        channel.members[0]?.id === user.id
          ? channel.members[1]
          : channel.members[0];
      return blocks.some((block) => block.id === otherUser?.id);
    }
  };

  const getOtherUserAvatar = (channel: Channel, user: User) => {
    const otherUser =
      channel.members[0]?.id === user.id
        ? channel.members[1]
        : channel.members[0];
    if (otherUser?.avatar) {
      return otherUser.avatar.path;
    } else {
      return '/avatar.png';
    }
  };

  return (
    <div className="my-[1rem]">
      <ul>
        {channels.map(
          (channel: Channel) =>
            !hideChannel(channel) && (
              <Card
                className={`mx-[0.5rem] my-[10px] flex h-[3.5rem] items-center rounded-md text-xl hover:cursor-pointer hover:border-black ${
                  selectedChannel === undefined
                    ? ''
                    : selectedChannel.id === channel.id
                    ? 'border-[2px] border-black'
                    : ''
                }`}
                onClick={() => {
                  updateSelectedChannel(channel);
                  setShowSettings(false);
                }}
                key={channel.id}
              >
                <div className="mx-[0.5rem] w-[45px]">
                  <Image
                    src={
                      channel.isDM
                        ? getOtherUserAvatar(channel, user)
                        : '/avatar.png'
                    }
                    alt="pic"
                    height={100}
                    width={100}
                    className="rounded-full bg-white"
                  />
                </div>
                <div className="relative truncate flex h-[100%] grow py-[0.3rem] ">
                  <h3 className="">{displayString(channel.name, 13)}</h3>
                  <p className="absolute top-6 max-w-[100%] truncate text-[10px]">
                    {displayLastMessage(channel, blocks)}
                  </p>
                </div>
                <div
                  className={`mx-[0.5rem] h-[0.5rem] w-[0.5rem] rounded-full ${
                    channel.msgNotification &&
                    'animate-ping bg-[#10F990] delay-150'
                  }`}
                ></div>
              </Card>
            ),
        )}
      </ul>
    </div>
  );
}
