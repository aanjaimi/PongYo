import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { fetcher } from "@/utils/fetcher";
import { type User } from "@/types/user";
import { QueryClient, useMutation } from "@tanstack/react-query";

type DataForm = {
  displayname?: string;
  // avatar?: string;
  tfa?: boolean;
};

export const updateProfile = async (payload: FormData) => {
  return (await fetcher.patch<User>(`/users`, payload)).data;
};

type ProfileEditProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileEdit = ({ state, setState }: ProfileEditProps) => {
  const router = useRouter();
  const queryClient = new QueryClient();
  const [displayName, setDisplayName] = useState("");
  const avatarRef = useRef<HTMLInputElement | null>(null);

  const userMutation = useMutation({
    mutationKey: ["users", "@me"],
    mutationFn: updateProfile,
  });

  const handleSubmit = async () => {
    await userMutation
      .mutateAsync({
        displayname: displayName,
        avatar: avatarRef.current?.files?.[0],
      })
      .then((resp) => {
        queryClient.invalidateQueries(["users", "@me"]).catch((err) => {
          console.log(err);
        });
        setState(true);
        router.push("/profile/@me").catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSkip = async () => {
    const resp = await userMutation
      .mutateAsync({})
      .then((resp) => {
        queryClient.invalidateQueries(["users", "@me"]).catch((err) => {
          console.log(err);
          setState(true);
        });
        router.push("/profile/@me").catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {!state && (
        <div className="flex h-screen w-screen items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>SET UP YOUR PROFILE</CardTitle>
              <CardDescription>Set Your Informations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-[10px] grid w-full max-w-sm items-center gap-1.5">
                <Label>Display Name</Label>
                <Input
                  id="Display Name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="mb-[10px] grid w-full max-w-sm items-center gap-1.5">
                <Label>Avatar</Label>
                <Input id="avatar" type="file" ref={avatarRef} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleSkip}>Skip</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default ProfileEdit;
