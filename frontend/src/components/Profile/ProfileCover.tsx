import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useStateContext } from "@/contexts/state-context";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { LogOut } from "lucide-react";
import { env } from "@/env.mjs";
import FriendshipStat from "@/components/friend/FriendshipStat";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QRCode from "react-qr-code";
import { Switch } from "@/components/ui/switch";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { updateProfile } from "@/components/Profile/ProfileCompletion";

type ProfileCoverProps = {
  isEdited: boolean;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
};

const ProfileCover = ({ user, isEdited, setIsEdited }: ProfileCoverProps) => {
  const { state, dispatch } = useStateContext();
  const queryClient = new QueryClient();
  const router = useRouter();
  const [dialogOn, setDialogOn] = useState(false);
  const [displayName, setDisplayName] = useState(state.user?.displayname);
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(() => {
    if (state.user?.totp.enabled) return state.user.totp.otpauth_url;
    return "";
  });

  useEffect(() => {
    setIsOwner(state.user?.id === user.id);
    if (state) setDisplayName(state.user?.displayname);
  }, [state, user.id]);

  const [otp, setOtp] = useState(() => {
    if (state.user?.totp.enabled) return state.user.totp.enabled;
    return false;
  });

  const userMutation = useMutation({
    mutationKey: ["users", "@me"],
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      dispatch({ type: "SET_USER", payload: data });
      await queryClient.invalidateQueries(["users", "@me"]);
    },
  });

  const toggleOtp = async () => {
    setOtp(!otp);
    const payload = new FormData();
    payload.append("tfa", !otp ? "true" : "false");
    const user = await userMutation.mutateAsync(payload);
    if (user.totp.enabled) setQrCodeData(user.totp.otpauth_url);
  };

  const handleSubmit = async () => {
    const payload = new FormData();
    if (displayName!.length != 0) payload.append("displayname", displayName!);
    if (avatarRef.current?.files?.[0])
      payload.append("avatar", avatarRef.current?.files?.[0] as Blob);
    await userMutation
      .mutateAsync(payload)
      .then(() => {
        setIsEdited(true);
        setDialogOn(false);
        void queryClient.invalidateQueries(["users", "@me"]);
        void router.push("/profile/@me");
      })
      .catch((err) => {
        console.log(err);
      });
    await queryClient.invalidateQueries(["users", "@me"]);
  };

  return (
    <>
      {isEdited && (
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
          <div className="h-[120px] w-[400px] rounded-b-2xl border sm:h-[120px] md:h-[78px] md:w-[600px] lg:w-[968px]">
            <div className="mt-[50px] flex justify-between font-semibold text-black sm:mx-[5px] sm:mt-[50px] md:ml-[180px] md:mt-[10px]">
              <div className="ml-[20px] flex grow flex-col md:ml-[2px]">
                <span className="text-[15px] text-black">
                  {user.displayname}
                </span>
                <span className="text-[15px] text-[#A5A3A3]">
                  @{user.login}
                </span>
              </div>
              {!isOwner && <FriendshipStat user={user} />}
              {isOwner && (
                <div className="mr-[20px] flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        className="w-[130px] bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]"
                        onClick={() => setDialogOn(true)}
                      >
                        Edit profile
                      </Button>
                    </DialogTrigger>
                    {dialogOn && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mb-[5px] mt-[10px] grid w-full max-w-sm items-center gap-1.5">
                          <Label>DisplayName</Label>
                          <Input
                            id="DisplayName"
                            placeholder="DisplayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                          />
                        </div>
                        <div className="mb-[5px] mt-[10px] grid w-full max-w-sm items-center gap-1.5">
                          <Label>Avatar</Label>
                          <Input id="avatar" type="file" ref={avatarRef} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label className="mb-[5px] mt-[10px] w-[400px]">
                            Two Factor Authentication is{" "}
                            {otp ? <>Enabled</> : <>Disabled</>} now switch to{" "}
                            {otp ? <>Disable</> : <>Enable</>}
                          </Label>
                          <Switch
                            checked={otp}
                            onCheckedChange={() => void toggleOtp()}
                          />
                        </div>
                        {otp && (
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <h1>Generate QR Code</h1>

                            <QRCode value={qrCodeData} />
                          </div>
                        )}
                        <div className="flex justify-between">
                          <div className="mt-[20px] flex grow justify-end">
                            <Button
                              disabled={userMutation.isLoading}
                              className="bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]"
                              onClick={() => void handleSubmit()}
                            >
                              <>Save changes</>
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    )}
                    <a
                      href={env.NEXT_PUBLIC_BACKEND_ORIGIN + "/auth/logout"}
                      className="cursor-pointer"
                    >
                      <LogOut />
                    </a>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
          {/* Avatar */}
          <div className="bottom-[90px] left-50 absolute md:bottom-10 md:left-20">
            <Image
              className="rounded-full"
              src={user.avatar.path}
              alt="API Image"
              width={90}
              height={90}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCover;
