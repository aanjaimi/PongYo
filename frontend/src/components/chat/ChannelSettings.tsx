import type { Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';
import { env } from '@/env.mjs';
import ChannelSettingsContent from './ChannelSettingsContent';

interface channelSettingsProps {
  channel: Channel;
  updateSelectedChannel: (arg: Channel | undefined) => void;
  user: User;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  setShowSettings: (arg: boolean) => void;
}

export default function ChannelSettings({
  channel,
  updateSelectedChannel,
  user,
  channels,
  updateChannels,
  setShowSettings,
}: channelSettingsProps) {
  const url = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [editChannelName, setEditChannelName] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  const inviteUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // axios
    //   .post(`${url}/invitePath???`, {}, { withCredentials: true })
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((err) => console.log(err));
    setUserName('');
    e.currentTarget.reset();
  };

  return (
    <>
      <div className="flex grow flex-col">
        <div className="flex items-center justify-between">
          <div>
            {user.id === channel.ownerId && (
              <Dialog>
                <DialogTrigger className="m-[1rem] w-[25px] hover:cursor-pointer">
                  <Image src="/edit1.png" alt="edit" width={50} height={50} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit channel</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <button
            className="m-[1rem] flex h-6 w-6 items-center justify-center rounded-full pb-1 bg-[#abd9d9b3]"
            onClick={() => setShowSettings(false)}
          >
            x
          </button>
        </div>
        <Image
          src="/avatar.png"
          alt="channelAvatar"
          width={75}
          height={75}
          className="my-[0.5rem] self-center"
        />
        <h1 className="my-[0.5rem] text-center text-2xl font-bold">
          {channel.name}
        </h1>
        {/* Separator */}
        <div className="mx-[2rem] my-[1rem] rounded-full border"></div>
        <form
          className="my-[0.5rem] ml-6 flex w-[15rem] self-center rounded-full bg-white"
          onSubmit={(e) => inviteUser(e)}
        >
          <input
            type="text"
            placeholder="username..."
            className="w-[75%] rounded-full bg-[#00000000] px-4 text-black focus:outline-none"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button className="flex w-[25%] items-center justify-center rounded-full border bg-[#2C9FE6]">
            invite
          </button>
        </form>
        <ChannelSettingsContent
          channel={channel}
          user={user}
        />
      </div>
    </>
  );
}
