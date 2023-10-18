import type { User } from '@/types/User';
import type { Channel } from '@/types/Channel';
import type { Message } from '@/types/Message';
import React, { use, useEffect, useState } from 'react';
import ChannelsList from './ChannelsList';
import ChannelContent from './ChannelContent';
import { ScrollArea } from '../ui/scroll-area';
import { useSocket } from '@/contexts/socket-context';

export default function Chat({ user }: { user: User }) {
  const { chatSocket } = useSocket();
  const [channels, setChannels] = useState<Channel[]>(user.channels);
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>(
    undefined,
  );

  useEffect(() => {
    chatSocket.on('message', (data: { channel: Channel } & Message) => {
      const channel = channels.find((channel) => channel.id === data.channelId);
      if (channel && data.userId !== user.id) {
        channel.messages.push(data);
        channel.updatedAt = data.createdAt;
        channels.sort((a, b) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return bDate.getTime() - aDate.getTime();
        });
        setChannels([...channels]);
        if (selectedChannel?.id === channel.id) {
          setSelectedChannel(channel);
        }
      } else if (!channel && data.userId !== user.id && data.channel.isDM) {
        const dmName: string[] = data.channel.name.split('-');
        data.channel.name = (dmName[0] === user.displayName
          ? dmName[1]
          : dmName[0]) as unknown as string;
        setChannels([data.channel, ...channels]);
        if (selectedChannel?.id === data.channel.id) {
          setSelectedChannel(data.channel);
        }
      }
    });

    return () => {
      chatSocket.off('message');
    };
  }, [channels, selectedChannel, user]);

  const updateChannels = (newChannels: Channel[]) => {
    setChannels(newChannels);
  };

  const updateSelectedChannel = (newSelectedChannel: Channel | undefined) => {
    setSelectedChannel(newSelectedChannel);
  };

  return (
    //Chat Box
    <div className="flex h-[50rem] w-[60rem] rounded-[6px] bg-[#33437D] text-white">
      <div className="flex h-[full] w-[25%] flex-col">
        <div className="flex h-[7%] items-center pl-[2rem] text-2xl ">
          chat room
        </div>
        {/* Seperator */}
        <div className="ml-1 rounded-l-full border"></div>
        <ScrollArea className="h-[93%]">
          <ChannelsList
            channels={channels}
            updateSelectedChannel={updateSelectedChannel}
            selectedChannel={selectedChannel}
          />
        </ScrollArea>
      </div>
      {/* Seperator */}
      <div className="my-1 rounded-full border"></div>
      <ChannelContent
        channel={selectedChannel}
        updateSelectedChannel={updateSelectedChannel}
        user={user}
        channels={channels}
        updateChannels={updateChannels}
      />
    </div>
  );
}
