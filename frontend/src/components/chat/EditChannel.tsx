import React, { useState } from 'react';
import { type ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Channel } from '@/types/Channel';
import { env } from '@/env.mjs';
import type { User } from '@/types/User';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface EditChannelProps {
  channel: Channel;
  user: User;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  updateSelectedChannel: (arg: Channel | undefined) => void;
}

export default function EditChannel({
  channel,
  channels,
  updateChannels,
  updateSelectedChannel,
}: EditChannelProps) {
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [channelName, setChannelName] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
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

  const editChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (channelName === '' || (isProtected && channelPassword === ''))
      return toast.error('Incomplete format', toastOptions);
    try {
      if (channelName.length > 30)
        return toast.error('Channel name too long', toastOptions);
      const { data }: { data: Channel } = await axios.patch(
        `${uri}/chat/Channel/${channel.id}`,
        {
          name: channelName,
          password: channelPassword,
          type: channelType,
        },
        { withCredentials: true },
      );
      const updatedChannels = channels.map((channel) => {
        if (channel.id === data.id) return data;
        return channel;
      });
      updateChannels(updatedChannels);
      updateSelectedChannel(data);
      setShowDialog(false);
      setChannelName('');
      setChannelPassword('');
      setChannelType('');
      setIsProtected(false);
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } }
      toast.error(error.response.data.message, toastOptions);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="m-[1rem] w-[25px] hover:cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        <Image src="/edit.png" alt="edit" width={50} height={50} />
      </DialogTrigger>
      {showDialog && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit channel</DialogTitle>
            <DialogDescription>
              Make changes to the channel here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4 py-4"
            onSubmit={(e) => {void editChannel(e)}}
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="channel name..."
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <RadioGroup
              defaultValue="comfortable"
              className="flex flex-col self-center"
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  password
                </Label>
                <Input
                  type="password"
                  id="name"
                  placeholder="password..."
                  className="col-span-3"
                  value={channelPassword}
                  onChange={(e) => setChannelPassword(e.target.value)}
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
