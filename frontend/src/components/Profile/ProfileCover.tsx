import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useStateContext } from "@/contexts/state-context";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import type { User } from "@/types/user";
import { QueryClient, useMutation } from "@tanstack/react-query";
import QRCode from "react-qr-code";
import { fetcher } from "@/utils/fetcher";

type ProfileCoverProps = {
  user: User;
};

async function updateProfile(payload: FormData) {
  return (await fetcher.patch<User>(`/users`, payload)).data;
}
const ProfileCover = ({ user }: ProfileCoverProps) => {
  const { state, dispatch } = useStateContext();
  // TODO: use must move the edit logic to component called ProfileEdit
  // name exists profileEdit to ProfileCompletion
  
  if (state.user?.id === user.id)
    user = state.user;
  const [on, setOn] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const queryClient = new QueryClient();
  const [qrCodeData, setQrCodeData] = useState(() => {
    if (user.totp.enabled) return user.totp.otpauth_url;
    return "";
  });
  const [isOwner, setIsOwner] = useState(false);
  const [otp, setOtp] = useState(() => {
    if (user.totp.enabled) return user.totp.enabled;
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

  useEffect(() => {
    setIsOwner(state.user?.id === user.id);
  }, [state.user?.id, user.id]);

  const toggleOtp = async () => {
    setOtp(!otp);
    const payload = new FormData();
    payload.append("tfa", !otp ? "true" : "false");
    const user = await userMutation.mutateAsync(payload);
    if (user.totp.enabled) setQrCodeData(user.totp.otpauth_url);
  };

  const handleSubmit = async () => {
    const payload = new FormData();
    if (displayName.length) payload.append("displayname", displayName);
    if (avatarRef.current?.files?.[0])
      payload.append("avatar", avatarRef.current?.files?.[0] as Blob);
    await userMutation.mutateAsync(payload);
    await queryClient.invalidateQueries(["users", "@me"]);
    setOn(false);
  };

  return (
    <>
      {user.isCompleted && (
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
                <span className="text-[20px] text-black">
                  {state.user?.displayname}
                </span>
                <span className="text-[20px] text-[#A5A3A3]">
                  @{state.user?.login}
                </span>
              </div>
              {!isOwner && (
                <div className="mr-[10px] flex justify-around">
                  <div className="ml-[15px] flex items-center">
                    <Button className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]">
                      Add friend
                    </Button>
                  </div>
                  <div className="ml-[15px] flex items-center">
                    <Button className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]">
                      Block
                    </Button>
                  </div>
                </div>
              )}
              {isOwner && (
                <div className="mr-[20px] flex items-center">
                  <Button
                    className="w-[130px] bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]"
                    onClick={() => setOn(true)}
                  >
                    <Dialog>
                      <DialogTrigger>Edit profile</DialogTrigger>
                      {on && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                              Make changes to your profile here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label>DisplayName</Label>
                            <Input
                              id="DisplayName"
                              placeholder="DisplayName"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                            />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
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
                          <div className="mt-[20px] flex justify-end">
                            <Button
                              disabled={userMutation.isLoading}
                              className="w-[130px] bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]"
                              onClick={() => void handleSubmit()}
                            >
                              Save changes
                            </Button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* Avatar */}
          <div className="bottom-50 left-50 absolute md:bottom-10 md:left-20">
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
