import type { Channel } from '@/types/Channel';
import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

const displayLastMessage = (channel: Channel) => {
  if (channel.messages.length > 0) {
    const lastMessage = channel.messages[channel.messages.length - 1];
    if (lastMessage)
      return `${lastMessage.user.displayName}: ${lastMessage.content}`;
    else return '';
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
  channels: Channel[];
  updateSelectedChannel: (arg: Channel | undefined) => void;
  selectedChannel: Channel | undefined;
}

export default function ChannelsList({
  channels,
  updateSelectedChannel,
  selectedChannel,
}: ChannelsListProps) {
  return (
    <div className="my-[1rem]">
      <ul>
        {channels.map((channel: Channel) => (
          <div
            className={`mx-[0.5rem] my-[5px] flex h-[3.5rem] items-center rounded-md text-xl hover:cursor-pointer hover:bg-[#382FA3] ${
              selectedChannel === undefined
                ? 'bg-[#6466F1]'
                : selectedChannel.id === channel.id
                ? 'bg-[#382FA3]'
                : 'bg-[#6466F1]'
            }`}
            onClick={() => {
              updateSelectedChannel(channel);
            }}
            key={channel.id}
          >
            <div className="mx-[0.5rem] w-[45px]">
              <Image
                src={channel.isDM ? '/avatar.png' : '/avatar.png'}
                alt="pic"
                height={100}
                width={100}
                className="rounded-full bg-white"
              />
            </div>
            <div className="relative flex h-[100%] grow py-[0.3rem] ">
              <h3 className="">{displayString(channel.name, 15)}</h3>
              <p className="absolute top-6 text-[10px] truncate max-w-[100%]">
                {displayLastMessage(channel)}
              </p>
            </div>
            <div
              className={`mx-[0.5rem] h-[0.5rem] w-[0.5rem] rounded-full ${
                channel.msgNotification && 'animate-ping bg-[#10F990] delay-150'
              }`}
            ></div>
          </div>
        ))}
      </ul>
    </div>
  );
}
