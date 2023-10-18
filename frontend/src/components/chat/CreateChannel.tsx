import React, { useState } from 'react';
import { type ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { User } from '@/types/User';
import type { Channel } from '@/types/Channel';
import { env } from '@/env.mjs';
import axios from 'axios';

interface CreateChannelProps {
  user: User;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  updateSelectedChannel: (arg: Channel | undefined) => void;
}

export default function CreateChannel({
  user,
  channels,
  updateChannels,
  updateSelectedChannel,
}: CreateChannelProps) {
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [channelName, setChannelName] = useState<string>('');
  const [channelPassword, setChannelPassword] = useState<string>('');
  const [channelType, setChannelType] = useState<string>('');
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const toastOptions: ToastOptions<object> = {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    theme: 'dark',
  };

  const createNewChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (channelName === '' || (isProtected && channelPassword === ''))
      return toast.error('Incomplete format', toastOptions);
    try {
      const { data }: { data: Channel } = await axios.post(
        `${uri}/chat/Channel`,
        {
          name: channelName,
          password: channelPassword,
          type: channelType,
        },
        { withCredentials: true },
      );
      updateChannels([data, ...channels]);
      updateSelectedChannel(data);
    } catch (err) {
      console.log(err);
      toast.error('Channel already exists', toastOptions);
    }
  };

  return (
    <form
      className="my-[1.5rem flex w-[75%] flex-col"
      onSubmit={createNewChannel}
    >
      <div className="my-[1rem] flex">
        <div className="text-xl">Create a channel:</div>
        <div className="ml-7 flex w-[13rem] rounded-full bg-white">
          <input
            type="text"
            placeholder="channel name..."
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full rounded-full bg-[#00000000] px-4 text-black focus:outline-none"
          />
        </div>
      </div>
      <RadioGroup
        defaultValue=""
        className="my-[1rem] ml-[35%] self-start text-white"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="Private"
            id="r1"
            className="bg-white"
            onClick={() => {
              setIsProtected(false);
              setChannelType('PRIVATE');
            }}
          />
          <Label htmlFor="r1">Private</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="Public"
            id="r2"
            className="bg-white"
            onClick={() => {
              setIsProtected(false);
              setChannelType('PUBLIC');
            }}
          />
          <Label htmlFor="r2">Public</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="Protected"
            id="r3"
            className="bg-white"
            onClick={() => {
              setIsProtected(true);
              setChannelType('PROTECTED');
            }}
          />
          <Label htmlFor="r3">Protected</Label>
        </div>
      </RadioGroup>
      {isProtected && (
        <div className="my-[0.5rem] ml-[1rem] flex w-[13rem] self-center rounded-full bg-white">
          <input
            type="password"
            placeholder="password..."
            value={channelPassword}
            onChange={(e) => setChannelPassword(e.target.value)}
            className="w-full rounded-full bg-[#00000000] px-4 text-black focus:outline-none"
          />
        </div>
      )}
      <button className="mt-[1.5rem] flex h-[2rem] w-[15%] items-center justify-center self-center rounded-full bg-[#2C9FE6]">
        Create
      </button>
    </form>
  );
}
