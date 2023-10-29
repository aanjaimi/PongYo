import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { env } from '@/env.mjs';
import { type ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Channel } from '@/types/channel';
import { fetcher } from '@/utils/fetcher';

interface ModeratorProps {
  channel: Channel;
}

export default function ChangeOwnership({ channel }: ModeratorProps) {
  const url = env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const toastOptions: ToastOptions<object> = {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    theme: 'dark',
  };

  const changeOwner = async () => {
    try {
      const newOwner = channel.members.find(
        (member) => member.displayname === userName.trim(),
      );
      if (!newOwner) return toast.error('User not found', toastOptions);
      await fetcher.patch(
        `/chat/channel/${channel.id}/owner`,
        { userId: newOwner?.id },
      );
      setUserName('');
      setShowDialog(false);
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error.response.data.message, toastOptions);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="m-[1rem]" onClick={() => setShowDialog(true)}>
          Change ownership
        </Button>
      </DialogTrigger>
      {showDialog && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change channel ownership</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                username
              </Label>
              <Input
                id="name"
                value={userName}
                placeholder="username"
                className="col-span-3"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
            onClick={() => {
              void changeOwner();
            }}
            >
              Make owner
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
