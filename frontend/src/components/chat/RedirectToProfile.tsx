import React from 'react';
import type { Channel } from '@/types/channel';
import type { User } from '@/types/user';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export default function Redirect({
  user,
  channel,
}: {
  user: User;
  channel: Channel;
}) {
  const otherUser = channel.members.find((member) => member.id !== user.id);
  const router = useRouter();
  const redirectToGame = () => {
    router
      .push(`/game?username=${otherUser?.login}`)
      .catch((err) => console.log(err));
  };

  const redirectToProfile = () => {
    router
      .push(`/profile/${otherUser?.login}`)
      .catch((err) => console.log(err));
  };

  if (!otherUser) {
    return <></>;
  }

  return (
    <div className="flex">
      <div className="mx-[1rem] w-[1.5rem] ">
        <Image
          src="/chat_profile.png"
          alt="profile"
          width={100}
          height={100}
          onClick={() => void redirectToProfile()}
          className="cursor-pointer"
        />
      </div>
      <div className="w-[1.5rem]">
        <Image
          src="/chat_game.svg"
          alt="profile"
          width={100}
          height={100}
          onClick={() => void redirectToGame()}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
