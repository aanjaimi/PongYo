import { ChatType, type Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import axios from 'axios';
import React, { useState } from 'react';
import { env } from '@/env.mjs';
import { useSocket } from '@/contexts/socket-context';
import { type ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function JoinChannel({
  user,
  channels,
  updateChannels,
  updateSelectedChannel,
}: {
  user: User;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  updateSelectedChannel: (arg: Channel | undefined) => void;
}) {
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const { chatSocket } = useSocket();
  const [passwordRequired, setPasswordRequired] = useState<boolean>(false);
  const [displayName, setdisplayName] = useState<string>('');
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
      (channel) => channel.name === displayName,
    );
    if (channel && channel.isDM) {
      updateSelectedChannel(channel);
      return;
    } else if (channel) return;

    try {
      const { data }: { data: Channel } = await axios.get(
        `${uri}/chat/directMessage?displayName=${displayName}`,
        {
          withCredentials: true,
        },
      );
      channel = data;
    } catch (err) {
      toast.error('User not found', toastOptions);
    } finally {
      if (!channel) return;

      chatSocket.emit('join-channel', { channelId: channel.id });

      const name: string[] = channel.name.split('-');
      channel.name = (name[0] === user.displayName
        ? name[1]
        : name[0]) as unknown as string;

      updateChannels([channel, ...channels]);
      updateSelectedChannel(channel);
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
        console.log('not protected');
        const { data }: { data: Channel } = await axios.get(
          `${uri}/chat/channel?name=${joinChannelName}`,
          { withCredentials: true },
        );
        channel = data;
        console.log(channel);
        if (channel.type === ChatType.PROTECTED) {
          console.log('protected');
          setPasswordRequired(true);
          channel = undefined;
          return;
        }
      } else {
        const { data }: { data: Channel } = await axios.post(
          `${uri}/chat/channel/${joinChannelName}`,
          {
            password: joinChannelPassword,
          },
          { withCredentials: true },
        );
        channel = data;
      }
    } catch (err) {
      toast.error('Channel not found', toastOptions);
    } finally {
      if (!channel) return;

      chatSocket.emit('join-channel', { channelId: channel.id });

      updateChannels([channel, ...channels]);
      updateSelectedChannel(channel);
    }
  };

  // todo finish the join channel component

  return (
    <div className="my-[1rem] ml-[15%] flex flex-col items-end self-start text-[18px]">
      <div className="my-[2rem] flex grow">
        <div className="text-xl">Direct message:</div>
        <form
          className="ml-6 flex w-[13rem] rounded-full bg-white"
          onSubmit={(e) => joinDirectMessage(e)}
        >
          <input
            type="text"
            placeholder="username..."
            className="w-[75%] rounded-full bg-[#00000000] px-4 text-black focus:outline-none"
            value={displayName}
            onChange={(e) => setdisplayName(e.target.value)}
          />
          <button className="flex w-[25%] items-center justify-center rounded-full border bg-[#2C9FE6]">
            Start
          </button>
        </form>
      </div>
      <div className="my-[2rem] flex">
        <div className="text-xl">Join a channel:</div>
        <form
          className="ml-6 flex w-[13rem] flex-col rounded-full"
          onSubmit={(e) => joinChannel(e)}
        >
          <div className="mb-[0.75rem] flex rounded-full bg-white">
            <input
              type="text"
              placeholder="channel name..."
              value={joinChannelName}
              onChange={(e) => {
                setJoinChannelName(e.target.value);
                setPasswordRequired(false);
              }}
              className="w-[75%] rounded-full bg-[#00000000] px-4 text-black focus:outline-none"
            />
            <button className="flex w-[25%] items-center justify-center rounded-full border bg-[#2C9FE6]">
              Join
            </button>
          </div>
          {passwordRequired && (
            <div className="flex flex-col">
              <input
                type="password"
                placeholder="password..."
                value={joinChannelPassword}
                onChange={(e) => setJoinChannelPassword(e.target.value)}
                className="rounded-full bg-white px-4  text-black focus:outline-none"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
