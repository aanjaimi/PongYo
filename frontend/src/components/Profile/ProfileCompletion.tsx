import { useEffect, useRef, useState } from 'react';
import { useStateContext } from '@/contexts/state-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/types/user';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetcher';
import { useRouter } from 'next/router';

export const updateProfile = async (payload: FormData) => {
  return (await fetcher.patch<User>(`/users`, payload)).data;
};

type ProfileCompletionProps = {
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileCompletion = ({ setIsEdited }: ProfileCompletionProps) => {
  const { state, dispatch } = useStateContext();
  const [displayname, setDisplayName] = useState(state.user?.displayname);
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const queryClient = new QueryClient();
  const router = useRouter();

  useEffect(() => {
    if (state) setDisplayName(state.user?.displayname);
  }, [state]);

  const userMutation = useMutation({
    mutationKey: ['users', '@me'],
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      dispatch({ type: 'SET_USER', payload: data });
      await queryClient.invalidateQueries(['users', '@me']);
    },
  });

  const handleSubmit = async () => {
    const payload = new FormData();
    if (displayname!.length != 0) payload.append('displayname', displayname!);
    if (avatarRef.current?.files?.[0])
      payload.append('avatar', avatarRef.current?.files?.[0] as Blob);
    await userMutation
      .mutateAsync(payload)
      .then(() => {
        setIsEdited(true);
        void queryClient.invalidateQueries(['users', '@me']);
        void router.push('/profile/@me');
      })
      .catch((err) => {
        console.log(err);
      });
    await queryClient.invalidateQueries(['users', '@me']);
  };

  const handleSkip = async () => {
    const payload = new FormData();
    payload.append('displayname', displayname!);
    await userMutation.mutateAsync(payload);
    setIsEdited(true);
    await queryClient.invalidateQueries(['users', '@me']);
    await router.push('/profile/@me');
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-[5px] mt-[10px] grid w-full max-w-sm items-center gap-1.5">
          <Label>DisplayName</Label>
          <Input
            id="DisplayName"
            placeholder="DisplayName"
            value={displayname}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="mb-[5px] mt-[10px] grid w-full max-w-sm items-center gap-1.5">
          <Label>Avatar</Label>
          <Input id="avatar" type="file" ref={avatarRef} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="mt-[20px] flex">
          <Button
            disabled={userMutation.isLoading}
            className="bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]"
            onClick={() => void handleSkip()}
          >
            <>Skip</>
          </Button>
        </div>
        <div className="mt-[20px] flex grow justify-end">
          <Button
            disabled={userMutation.isLoading}
            className="bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]"
            onClick={() => void handleSubmit()}
          >
            <>Submit</>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileCompletion;
