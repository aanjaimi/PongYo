import type { Channel, mute } from '@/types/channel';
import type { User } from '@/types/user';
import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState } from 'react';
import { fetcher } from '@/utils/fetcher';
import { env } from '@/env.mjs';
import { displayString } from './ChannelsList';

interface UserCardProps {
  channel: Channel;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  isOwner: () => boolean;
  cardUser: User;
  user: User;
}

export default function ModeratorCard({
  channel,
  channels,
  updateChannels,
  isOwner,
  cardUser,
  user,
}: UserCardProps) {
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [nameLenght, setNameLenght] = useState<number>(30);

  const isMuted = () => {
    if (channel.mutes) {
      const mutedUser = channel.mutes.find(
        (mute) => mute.userId === cardUser.id,
      );
      if (!mutedUser) return false;
      if (mutedUser && new Date(mutedUser.mutedUntil).getTime() > Date.now())
        return true;
    } else return false;
  };

  const mute = async () => {
    try {
      const { data } = await fetcher.patch<mute>(
        `${uri}/chat/channel/${channel.id}/mutes`,
        {
          userId: cardUser.id,
          muteDuration: 3600000,
        },
      );
      const oldMute = channel.mutes.find((mute) => mute.userId === cardUser.id);
      if (oldMute) {
        const updatedMutes = channel.mutes.filter(
          (mute) => mute.userId !== cardUser.id,
        );
        channel.mutes = updatedMutes;
      }
      const updatedMutes = [...channel.mutes, data];
      channel.mutes = updatedMutes;
      updateChannels([...channels]);
    } catch (err) {
      console.error(err);
    }
  };

  const unMute = async () => {
    try {
      await fetcher.delete(
        `${uri}/chat/channel/${channel.id}/mutes?userId=${cardUser.id}`,
      );
      const updatedMutes = channel.mutes.filter(
        (mute) => mute.userId !== cardUser.id,
      );
      channel.mutes = updatedMutes;
      updateChannels([...channels]);
    } catch (err) {
      console.error(err);
    }
  };

  const ban = async () => {
    try {
      await fetcher.patch(
        `${uri}/chat/channel/${channel.id}/bans`,
        {
          userId: cardUser.id,
          banDuration: 3600000,
        },
      );
      const updatedMembers = channel.members.filter(
        (member) => member.id !== cardUser.id,
      );
      channel.members = updatedMembers;
      updateChannels([...channels]);
    } catch (err) {
      console.error(err);
    }
  };

  const kick = async () => {
    try {
      await fetcher.delete(
        `${uri}/chat/channel/${channel.id}/kicks?userId=${cardUser.id}`,
        { withCredentials: true },
      );
      const updatedMembers = channel.members.filter(
        (member) => member.id !== cardUser.id,
      );
      channel.members = updatedMembers;
      updateChannels([...channels]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex grow justify-center">
      <Card
        className="my-[0.2rem] flex w-[55%] items-center justify-between py-[0.3rem] hover:border-black"
        onMouseEnter={() => {
          setShowDetails(true);
          user.id === channel.ownerId && setNameLenght(15);
        }}
        onMouseLeave={() => {
          setShowDetails(false);
          setNameLenght(30);
        }}
      >
        <div className="ml-[1rem] flex items-center">
          <div className="mr-[0.5rem] w-[3rem] rounded-full">
            <Image
              src={cardUser.avatar.path}
              alt="avatar"
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
          <h2 className="ml-[0.5rem] truncate">
            {displayString(cardUser.displayname, nameLenght)}
          </h2>
        </div>
        <div className="mr-[1rem]">
          {showDetails && user.id !== cardUser.id && isOwner() && (
            <>
              {isMuted() ? (
                <Button
                  className="mr-[0.5rem] h-[1.7rem] w-[3.7rem] bg-[#1E5D6C]"
                  onClick={() => {
                    void unMute();
                  }}
                >
                  Unmute
                </Button>
              ) : (
                <Button
                  className="mr-[0.5rem] h-[1.7rem] w-[3.7rem] bg-[#1E5D6C]"
                  onClick={() => {
                    void mute();
                  }}
                >
                  mute
                </Button>
              )}
              <Button
                className="mr-[0.5rem] h-[1.7rem] w-[3.7rem] bg-[#bd6d1c]"
                onClick={() => {
                  void kick();
                }}
              >
                Kick
              </Button>
              <Button
                className="h-[1.7rem] w-[3.7rem] bg-[#C83030]"
                onClick={() => {
                  void ban();
                }}
              >
                Ban
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
