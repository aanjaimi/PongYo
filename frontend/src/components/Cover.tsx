import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStateContext } from "@/contexts/state-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";

const Cover = () => {
  const { state } = useStateContext();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const resp = await fetcher.get<User>("/users/@me");
      setUser(resp.data);
    })().catch((err) => console.error(err));
  }, [state.user]);

  const isMe = state.user?.id === user?.id;

  return (
    <div className="relative mb-[19px] mt-[36px] flex flex-col items-center justify-center">
      {/* Cover  */}
      <div className="h-[100px] w-[400px] rounded-t-2xl md:h-[150px] md:w-[600px] lg:h-[242px] lg:w-[968px]">
        <Image
          className="rounded-t-2xl"
          src={"/cover.png"}
          alt="API Image"
          width={968}
          height={242}
        />
      </div>
      <div className="h-[120px] w-[400px] rounded-b-2xl bg-[#33437D] sm:h-[120px] md:h-[78px] md:w-[600px] lg:w-[968px]">
        <div className="mt-[60px] flex justify-between font-semibold text-black sm:mx-[5px] sm:mt-[60px] md:ml-[180px] md:mt-[10px]">
          <div className="flex grow flex-col">
            <p className="text-[10px] text-[#ffffff] sm:text-[10px] lg:text-[20px]">
              {state.user?.displayname}
            </p>
            <p className="sm: text-[10px] text-[#A5A3A3] sm:text-[10px] lg:text-[15px]">
              @{state.user?.login}
            </p>
          </div>
          {!isMe && (
            <div className="mr-[10px] flex justify-around">
              <div className="ml-[15px] flex items-center">
                <Button className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]">
                  Add friend
                </Button>
              </div>
              <div className="ml-[15px] flex items-center">
                <Button className="bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]">
                  Message
                </Button>
              </div>
              <div className="ml-[15px] flex items-center justify-center text-[10px] sm:text-[10px] md:text-[10px] lg:text-[15px]">
                <Button className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]">
                  <DropdownMenu>
                    <DropdownMenuTrigger>...</DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Block</DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Button>
              </div>
            </div>
          )}
          {isMe && (
            <div className="mr-[20px] flex items-center">
              <Button className="w-[130px] bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]">
                <Dialog>
                  <DialogTrigger>Edit profile</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="email">DisplayName</Label>
                      <Input placeholder="DisplayName" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="picturw">Avatar</Label>
                      <Input id="picture" type="file" />
                    </div>
                    <div className="mt-[20px] flex justify-end">
                      <Button className="w-[130px] bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]">
                        Save changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Avatar */}
      <div className="bottom-50 left-50 absolute md:bottom-10 md:left-20">
        <Image
          className="rounded-t-2xl"
          src={"/avatar.png"}
          alt="API Image"
          width={98}
          height={98}
        />
      </div>
    </div>
  );
};

export default Cover;
