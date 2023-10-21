import type { Channel } from '@/types/Channel';
import React from 'react';
import Image from 'next/image';

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
    <div>
      <ul>
        {channels.map((channel: Channel) => (
          <div
            className={`m-[5px] px-[1rem] flex h-[3.2rem] items-center justify-between rounded-md text-xl hover:cursor-pointer hover:bg-[#382FA3] ${
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
            <div>
              <Image 
                src={channel.isDM ? '/direct_chat_icon.png' : '/group_chat_icon.png'}
                alt='pic'
                height={25}
                width={25}
                className="bg-white rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-[md]">{channel.name}</div>
              {/* <div className="text-[12px] border">qwdqwd</div> */}
            </div>
            <div className={`w-[0.5rem] h-[0.5rem] rounded-full ${channel.msgNotification && 'bg-[#10F990] animate-ping delay-150'}`}></div>
          </div>
        ))}
      </ul>
    </div>
  );
}
