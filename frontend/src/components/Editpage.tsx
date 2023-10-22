import React, { useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { useStateContext } from "@/contexts/state-context";

const Editpage = () => {

  const { state } = useStateContext();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("");
  const queryClient = useQueryClient();

  const handleSubmit = () => {
    if (displayName !== "") {
      fetcher.patch(`/users/@me/update`, {
        displayName: displayName,
        twoFactorAuth: state.user?.twoFactorAuth,
        isComplete: "true",
      }).then((resp) => {
        if (resp.status === 200) {
          router.push("/profile/@me").catch((err) => {console.log(err)});
          queryClient.invalidateQueries(["users", "@me"]).catch((err) => {console.log(err)});
        }
      }
      ).catch((err) => {
        console.log(err);
      });
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>SET UP YOUR PROFILE</CardTitle>
          <CardDescription>Set Your Informations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-[10px]">
            <Label>Display Name</Label>
            <Input id="Display Name" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}/>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-[10px]">
            <Label>Avatar</Label>
            <Input id="Avatar" type="file" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => {router.push("/profile/@me").catch((err) => {console.log(err)}) }}>Skip</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Editpage;
