import React, { useState } from 'react';
import { type ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { User } from '@/types/User';
import type { Channel } from '@/types/Channel';
import { env } from '@/env.mjs';
import axios from 'axios';
import { useSocket } from '@/contexts/socket-context';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface CreateChannelProps {
  user: User;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  updateSelectedChannel: (arg: Channel | undefined) => void;
}

export default function CreateChannel({
  channels,
  updateChannels,
  updateSelectedChannel,
}: CreateChannelProps) {
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const { chatSocket } = useSocket();
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
    if (channelName === '' || (isProtected && channelPassword === '') || channelType === '')
      return toast.error('Incomplete format', toastOptions);
    try {
      console.log(channelName, channelPassword, channelType);
      const { data }: { data: Channel } = await axios.post(
        `${uri}/chat/Channel`,
        {
          name: channelName,
          password: channelPassword,
          type: channelType,
        },
        { withCredentials: true },
      );
      chatSocket.emit('join-channel', { channelId: data.id });
      updateChannels([data, ...channels]);
      updateSelectedChannel(data);
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error.response.data.message, toastOptions);
    }
  };

  return (
    <form
      className="flex w-[75%] flex-col"
      onSubmit={(e) => (void createNewChannel(e))}
    >
      <div className="my-[1rem] flex">
        <div className="text-xl">Create a channel:</div>
        <div className="ml-7 flex w-[13rem] rounded-full bg-white">
          <Input
            type="text"
            placeholder="channel name..."
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="border-[2px] border-black"
          />
        </div>
      </div>
      <RadioGroup
        defaultValue=""
        className="my-[1rem] ml-[35%] self-start"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="Private"
            id="r1"
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
            onClick={() => {
              setIsProtected(true);
              setChannelType('PROTECTED');
            }}
          />
          <Label htmlFor="r3">Protected</Label>
        </div>
      </RadioGroup>
      {isProtected && (
        <div className="my-[0.5rem] ml-[28.5%] flex w-[12.5rem] rounded-full bg-white">
          <Input
            type="password"
            placeholder="password..."
            value={channelPassword}
            onChange={(e) => setChannelPassword(e.target.value)}
            className="border-[2px] border-black"
          />
        </div>
      )}
      <Button className="mt-[1.5rem] self-center">
        Create
      </Button>
    </form>
  );
}
