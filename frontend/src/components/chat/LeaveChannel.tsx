import { fetcher } from '@/utils/fetcher';
import React from 'react';
import { Button } from '../ui/button';
import type { Channel } from '@/types/channel';
import { env } from '@/env.mjs';

interface LeaveChannelProps {
  channel: Channel;
  setShowSettings: (arg: boolean) => void;
}

export default function LeaveChannel({
  channel,
  setShowSettings,
}: LeaveChannelProps) {
  const url = env.NEXT_PUBLIC_BACKEND_ORIGIN;

  const leaveChannel = async () => {
    try {
      await fetcher.delete(`/chat/channel/${channel.id}/leave`);
      setShowSettings(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      className="m-[1rem] bg-[#C83030]"
      onClick={() => {
        void leaveChannel();
      }}
    >
      Leave Channel
    </Button>
  );
}
