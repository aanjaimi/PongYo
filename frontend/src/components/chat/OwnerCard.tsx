import type { User } from '@/types/user';
import React from 'react';
import Image from 'next/image';
import { Card } from '../ui/card';

export default function OwnerCard({ user }: { user: User }) {
  return (
    <div className="flex grow justify-center">
      <Card className="flex w-[55%] items-center justify-between self-center py-[0.3rem] hover:border-black">
        <div className="ml-[1rem] flex items-center">
          <div className="mr-[0.5rem] w-[3rem] rounded-full">
            <Image
              src={user.avatar.path}
              alt="avatar"
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
          <h2 className="ml-[0.5rem]">{user.displayname}</h2>
        </div>
        <div className="mr-[1rem]"></div>
      </Card>
    </div>
  );
}
