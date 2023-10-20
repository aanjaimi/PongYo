import type { Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import type { Message } from '@/types/Message';
import React, { useState } from 'react';
import ChannelInfo from './ChannelInfo';
import CreateOrJoin from './CreateOrJoin';
import Image from 'next/image';
import ScrollableFeed from 'react-scrollable-feed';
import axios from 'axios';
import { env } from '@/env.mjs';

export default function ChannelContent({
  channel,
  updateSelectedChannel,
  user,
  channels,
  updateChannels,
}: {
  channel: Channel | undefined;
  updateSelectedChannel: (arg: Channel | undefined) => void;
  user: User;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
}) {
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [message, setMessage] = useState<string>('');

  if (channel === undefined)
    return (
      <CreateOrJoin
        user={user}
        channels={channels}
        updateChannels={updateChannels}
        updateSelectedChannel={updateSelectedChannel}
      />
    );

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (message.trim() === '') return;
      const { data }: { data: Message } = await axios.post(
        `${uri}/chat/channel/${channel.id}/messages`,
        { content: message },
        { withCredentials: true },
      );
      channel.messages.push(data);
      channel.updatedAt = data.createdAt;
      channels.sort((a, b) => {
        const aDate = new Date(a.updatedAt);
        const bDate = new Date(b.updatedAt);
        return bDate.getTime() - aDate.getTime();
      });
      updateChannels([...channels]);
      setMessage('');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-[100%] w-[75%] flex-col">
      <ChannelInfo
        channel={channel}
        updateSelectedChannel={updateSelectedChannel}
      />
      {/* seperator */}
      <div className="mr-1 rounded-r-full border"></div>
      {/* channel messages container*/}
      <div className="pb-10px flex h-[86%] flex-col justify-end">
        <ScrollableFeed className="grow py-[0.5rem]">
          {channel?.messages?.map((message) => (
            <div
              className={`chat ml-[0.75rem] justify-self-end rounded-md ${
                message.userId === user.id ? 'chat-end' : 'chat-start'
              }`}
              key={message.id}
            >
              <div className="avatar chat-image">
                <div className="w-7 rounded-full">
                  <Image
                    src="/avatar.png"
                    alt="avatar"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
              {/* <div className="chat-header text-[#9bb3c7]">
                {message.userId}
              </div> */}
              <div
                className={`chat-bubble max-w-[36rem] text-white ${
                  message.userId === user.id
                    ? 'bg-[#8d8ddab3]'
                    : 'bg-[#abd9d9b3]'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </ScrollableFeed>
      </div>
      <form
        className="mx-[1rem] mt-[1rem] flex h-[2rem] rounded-full border bg-[#d9d9d933]"
        onSubmit={(e) => sendMessage(e)}
      >
        <input
          type="text"
          placeholder="type your message here..."
          value={message}
          className="h-[2rem] w-[90%] rounded-l-full bg-[#00000000] px-3 pb-[5px] focus:outline-none"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="flex w-[10%] items-center justify-center rounded-full bg-[#382FA3]">
          <Image
            className=""
            src={'/send_button.png'}
            alt="image"
            width={21}
            height={16}
          />
        </button>
      </form>
    </div>
  );
}
