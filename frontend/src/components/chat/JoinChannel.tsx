import { ChatType, type Channel } from '@/types/channel';
import type { User } from '@/types/user';
import { fetcher } from '@/utils/fetcher';
import React, { useState } from 'react';
import { env } from '@/env.mjs';
import { useSocket } from '@/contexts/socket-context';
import { type ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { FriendShip } from '@/types/friend';

interface JoinChannelProps {
  user: User;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  updateSelectedChannel: (arg: Channel | undefined) => void;
  blocks: FriendShip[];
}

export default function JoinChannel({
  user,
  channels,
  updateChannels,
  updateSelectedChannel,
  blocks,
}: JoinChannelProps) {
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const { chatSocket } = useSocket();
  const [passwordRequired, setPasswordRequired] = useState<boolean>(false);
  const [displayname, setdisplayname] = useState<string>('');
  const [joinChannelName, setJoinChannelName] = useState<string>('');
  const [joinChannelPassword, setJoinChannelPassword] = useState<string>('');
  const toastOptions: ToastOptions<object> = {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    theme: 'dark',
  };

  const joinDirectMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let channel: Channel | undefined = channels.find(
      (channel) => channel.name === displayname,
    );
    if (channel && channel.isDM) {
      updateSelectedChannel(channel);
      return;
    } else if (channel) return;

    try {
      const { data } = await fetcher.get<Channel>(
        `/chat/directMessage?displayname=${displayname}`,
      );
      channel = data;
      if (!channel) return;

      const name: string[] = channel.name.split('-');
      channel.name = (name[0] === user.displayname
        ? name[1]
        : name[0]) as unknown as string;

      updateChannels([channel, ...channels]);
      updateSelectedChannel(channel);
    } catch (err) {
      toast.error('User not found', toastOptions);
    }
  };

  const joinChannel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let channel: Channel | undefined = channels.find(
      (channel) => channel.name === joinChannelName,
    );
    if (channel) {
      updateSelectedChannel(channel);
      return;
    }

    try {
      if (!passwordRequired) {
        const { data } = await fetcher.get<Channel>(
          `/chat/channel?name=${joinChannelName}`,
        );
        channel = data;
        if (channel.type === ChatType.PROTECTED) {
          setPasswordRequired(true);
          channel = undefined;
          return;
        } else {
          const { data } = await fetcher.patch<Channel>(
            `/chat/channel/${channel.id}/join`,
            { password: '' },
          );
          channel = data;
        }
      } else {
        if (!joinChannelPassword)
          return toast.error("Password can't be empty", toastOptions);
        {
          const { data } = await fetcher.get<Channel>(
            `/chat/channel?name=${joinChannelName}`,
          );
          channel = data;
        }
        const { data } = await fetcher.patch<Channel>(
          `/chat/channel/${channel.id}/join`,
          { password: joinChannelPassword },
        );
        channel = data;
      }
      if (!channel) return;

      chatSocket.emit('join-channel', { channelId: channel.id });

      updateChannels([channel, ...channels]);
      updateSelectedChannel(channel);
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      console.log('error');
      toast.error(error.response.data.message, toastOptions);
    }
  };

  return (
    <div className="ml-[15%] mt-[1rem] flex flex-col items-end self-start text-[18px]">
      <div className="my-[2rem] flex grow">
        <div className="text-xl">Direct message:</div>
        <form
          className="ml-6 flex w-[17rem] rounded-full bg-white"
          onSubmit={(e) => {
            void joinDirectMessage(e);
          }}
        >
          <Input
            type="text"
            placeholder="username..."
            className="mr-[1rem] border-[2px] border-black"
            value={displayname}
            onChange={(e) => setdisplayname(e.target.value)}
          />
          <Button>start</Button>
        </form>
      </div>
      <div className="my-[2rem] flex">
        <div className="text-xl">Join a channel:</div>
        <form
          className="ml-6 flex w-[17rem] flex-col rounded-full"
          onSubmit={(e) => {
            void joinChannel(e);
          }}
        >
          <div className="mb-[0.75rem] flex rounded-full bg-white">
            <Input
              type="text"
              placeholder="channel name..."
              value={joinChannelName}
              onChange={(e) => {
                setJoinChannelName(e.target.value);
                setPasswordRequired(false);
              }}
              className="mr-[1rem] border-[2px] border-black"
            />
            <Button>Join</Button>
          </div>
          {passwordRequired && (
            <div className="flex w-[12.5rem] flex-col">
              <Input
                type="password"
                placeholder="password..."
                value={joinChannelPassword}
                onChange={(e) => setJoinChannelPassword(e.target.value)}
                className="border-[2px] border-black"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
