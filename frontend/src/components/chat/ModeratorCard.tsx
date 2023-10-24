import type { Channel } from '@/types/Channel';
import type { User } from '@/types/User';
import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState } from 'react';

interface UserCardProps {
  channel: Channel;
  isOwner: () => boolean;
  cardUser: User;
  user: User;
}

export default function ModeratorCard({
  isOwner,
  cardUser,
  user,
}: UserCardProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

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
            (isOwner()) && (
              <>
                <Button className="mr-[0.5rem] h-[1.7rem] w-[3.5rem] bg-[#1E5D6C]">
                  Mute
                </Button>
                <Button className="h-[1.7rem] w-[3.5rem] bg-[#C83030]">
                  Ban
                </Button>
              </>
            )}
        </div>
      </Card>
    </div>
  );
}
