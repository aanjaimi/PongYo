import type { User } from '@/types/User';
import type { Channel, mute, ban } from '@/types/Channel';
import type { Message } from '@/types/Message';
import React, { use, useEffect, useState } from 'react';
import ChannelsList from './ChannelsList';
import ChannelContent from './ChannelContent';
import { ScrollArea } from '../ui/scroll-area';
import { useSocket } from '@/contexts/socket-context';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
        if (selectedChannel?.id === channel.id) {
          setSelectedChannel(channel);
        } else {
          channel.msgNotification = true;
        }
        setChannels([...channels]);
      } else if (!channel && data.userId !== user.id && data.channel.isDM) {
        const dmName: string[] = data.channel.name.split('-');
        data.channel.name = (dmName[0] === user.displayName
          ? dmName[1]
          : dmName[0]) as unknown as string;
        data.channel.msgNotification = true;
        setChannels([data.channel, ...channels]);
        if (selectedChannel?.id === data.channel.id) {
          setSelectedChannel(data.channel);
        }
      }
    });

    chatSocket.on('join', (data: { user: User; channelId: string }) => {
      if (data.user.id !== user.id) {
        const channel = channels.find(
          (channel) => channel.id === data.channelId,
        );
        if (!channel) return;
        const updatedMembers = [...channel.members, data.user];
        channel.members = updatedMembers;
        setChannels([...channels]);
      }
    });

    chatSocket.on('mute', (data: mute) => {
      const channel = channels.find((channel) => channel.id === data.channelId);
      if (!channel) return;
      const oldMute = channel.mutes.find((mute) => mute.userId === data.userId);
      if (oldMute) {
        const updatedMutes = channel.mutes.filter(
          (mute) => mute.userId !== data.userId,
        );
        channel.mutes = updatedMutes;
      }
      const updatedMutes = [...channel.mutes, data];
      channel.mutes = updatedMutes;
      setChannels([...channels]);
    });

    chatSocket.on('ban', (data: ban) => {
      const channel = channels.find((channel) => channel.id === data.channelId);
      if (!channel) return;
      const oldBan = channel.bans.find((ban) => ban.userId === data.userId);
      if (oldBan) {
        const updatedBans = channel.bans.filter(
          (ban) => ban.userId !== data.userId,
        );
        channel.bans = updatedBans;
      }
      const updatedBans = [...channel.bans, data];
      channel.bans = updatedBans;
      setChannels([...channels]);
    });

    chatSocket.on('unmute', (data: mute) => {
      const channel = channels.find((channel) => channel.id === data.channelId);
      if (!channel) return;
      const updatedMutes = channel.mutes.filter(
        (mute) => mute.userId !== data.userId,
      );
      channel.mutes = updatedMutes;
      setChannels([...channels]);
    });

    chatSocket.on('unban', (data: ban) => {
      const channel = channels.find((channel) => channel.id === data.channelId);
      if (!channel) return;
      const updatedBans = channel.bans.filter(
        (ban) => ban.userId !== data.userId,
      );
      channel.bans = updatedBans;
      setChannels([...channels]);
    });

    chatSocket.on('kick', (data: { userId: string; channelId: string }) => {
      if (data.userId === user.id) {
        const updatedChannels = channels.filter(
          (channel) => channel.id !== data.channelId,
        );
        setChannels(updatedChannels);
        setSelectedChannel(undefined);
        return;
      }
      const channel = channels.find((channel) => channel.id === data.channelId);
      if (!channel) return;
      const updatedMembers = channel.members.filter(
        (member) => member.id !== data.userId,
      );
      channel.members = updatedMembers;
      setChannels([...channels]);
    });

    return () => {
      chatSocket.off('message');
      chatSocket.off('mute');
      chatSocket.off('ban');
      chatSocket.off('unmute');
      chatSocket.off('unban');
      chatSocket.off('kick');
      chatSocket.off('join');
    };
  }, [channels, selectedChannel, user, chatSocket]);

  const updateChannels = (newChannels: Channel[]) => {
    setChannels(newChannels);
  };

  const updateSelectedChannel = (newSelectedChannel: Channel | undefined) => {
    if (newSelectedChannel) {
      newSelectedChannel.msgNotification = false;
    }
    setSelectedChannel(newSelectedChannel);
  };

  return (
    //Chat Box

    <Card className="flex h-[55rem] w-[70rem] rounded-[6px] border-[2px] border-black">
      <div className="flex h-[full] w-[25%] flex-col">
        <div className="flex h-[7%] items-center pl-[2rem] text-2xl ">
          chat room
        </div>
        {/* Seperator */}
        <div className="ml-1 rounded-l-full border border-black"></div>
        <ScrollArea className="h-[93%]">
          <ChannelsList
            channels={channels}
            updateSelectedChannel={updateSelectedChannel}
            selectedChannel={selectedChannel}
          />
        </ScrollArea>
      </div>
      {/* Seperator */}
      <div className="my-1 rounded-full border border-black"></div>
      <ChannelContent
        channel={selectedChannel}
        updateSelectedChannel={updateSelectedChannel}
        user={user}
        channels={channels}
        updateChannels={updateChannels}
      />
    </Card>
  );
}
