import type { Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export default function OwnerCard({ user }: { user: User }) {
  return (
    <div className='grow flex justify-center'>
      <Card className="flex w-[55%] items-center justify-between self-center py-[0.3rem] hover:border-black">
        <div className="ml-[1rem] flex items-center">
          <div className="mr-[0.5rem] w-[3rem] rounded-full">
            <Image src="/avatar.png" alt="avatar" width={200} height={200} />
          </div>
          <h2 className="ml-[0.5rem]">{user.displayName}</h2>
        </div>
        <div className="mr-[1rem]"></div>
      </Card>
    </div>
  );
}
