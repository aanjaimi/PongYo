import type { Channel, mute } from '@/types/Channel';
import type { User } from '@/types/User';
import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState } from 'react';
import axios from 'axios';
import { env } from '@/env.mjs';

interface UserCardProps {
  channel: Channel;
  channels: Channel[];
  updateChannels: (arg: Channel[]) => void;
  isModerator: () => boolean;
  isOwner: () => boolean;
  cardUser: User;
  user: User;
}

export default function UserCard({
  channel,
  channels,
  updateChannels,
  isModerator,
  isOwner,
  cardUser,
  user,
}: UserCardProps) {
  const uri = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [showDetails, setShowDetails] = useState<boolean>(false);

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
      const { data }: { data: mute } = await axios.patch(
        `${uri}/chat/channel/${channel.id}/mutes`,
        {
          userId: cardUser.id,
          muteDuration: 3600000,
        },
        { withCredentials: true },
      );
      const updatedMutes = [...channel.mutes, data];
      channel.mutes = updatedMutes;
      updateChannels([...channels]);
    } catch (err) {
      console.log(err);
    }
  };

  const kick = async () => {
    try {
      await axios.delete(
        `${uri}/chat/channel/${channel.id}/kicks?userId=${cardUser.id}`,
        { withCredentials: true },
      );
      const updatedMembers = channel.members.filter(
        (member) => member.id !== cardUser.id,
      );
      channel.members = updatedMembers;
      updateChannels([...channels]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex grow justify-center">
      <Card
        className="my-[0.2rem] flex w-[55%] items-center justify-between py-[0.3rem] hover:border-black"
        onMouseEnter={(e) => setShowDetails(true)}
        onMouseLeave={(e) => setShowDetails(false)}
      >
        <div className="ml-[1rem] flex items-center">
          <div className="mr-[0.5rem] w-[3rem] rounded-full">
            <Image src="/avatar.png" alt="avatar" width={200} height={200} />
          </div>
          <h2 className="ml-[0.5rem]">{cardUser.displayName}</h2>
        </div>
        <div className="mr-[1rem]">
          {showDetails &&
            user.id !== cardUser.id &&
            (isModerator() || isOwner()) && (
              <>
                {isMuted() ? (
                  <Button className="mr-[0.5rem] h-[1.7rem] w-[3.7rem] bg-[#1E5D6C]">
                    Unmute
                  </Button>
                ) : (
                  <Button
                    className="mr-[0.5rem] h-[1.7rem] w-[3.7rem] bg-[#1E5D6C]"
                    onClick={() => mute()}
                  >
                    mute
                  </Button>
                )}
                <Button
                  className="mr-[0.5rem] h-[1.7rem] w-[3.7rem] bg-[#bd6d1c]"
                  onClick={() => kick()}
                >
                  Kick
                </Button>
                <Button className="h-[1.7rem] w-[3.7rem] bg-[#C83030]">
                  Ban
                </Button>
              </>
            )}
        </div>
      </Card>
    </div>
  );
}
