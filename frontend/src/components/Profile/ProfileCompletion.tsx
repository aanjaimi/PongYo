import { useRef, useState } from "react";
import { useStateContext } from "@/contexts/state-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/types/user";
import { QueryClient, useMutation } from "@tanstack/react-query";
import QRCode from "react-qr-code";
import { fetcher } from "@/utils/fetcher";
import { useRouter } from "next/router";
import { stat } from "fs";

export const updateProfile = async (payload: FormData) => {
  return (await fetcher.patch<User>(`/users`, payload)).data;
};

type ProfileCompletionProps = {
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  inProfileEdit: boolean;
};

const ProfileCompletion = ({
  setOn,
  setIsEdited,
  inProfileEdit,
}: ProfileCompletionProps) => {
  const { state, dispatch } = useStateContext();
  const [openDialog, setOpenDialog] = useState(true);
  const [displayName, setDisplayName] = useState(
    () => state.user?.displayname ?? ""
  );
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const queryClient = new QueryClient();
  const router = useRouter();
  const [qrCodeData, setQrCodeData] = useState(() => {
    if (state.user?.totp.enabled) return state.user.totp.otpauth_url;
    return "";
  });

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
    if (displayName.length != 0) payload.append("displayname", displayName);
    if (avatarRef.current?.files?.[0])
      payload.append("avatar", avatarRef.current?.files?.[0] as Blob);
    await userMutation
      .mutateAsync(payload)
      .then(() => {
        setIsEdited(true);
        setOn(false);
        setOpenDialog(false);
        queryClient.invalidateQueries(["users", "@me"]).catch((err) => {
          console.log(err);
          router.push("/profile/@me").catch((err) => {
            console.log(err);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("payload4: ", payload);
    await queryClient.invalidateQueries(["users", "@me"]);
  };

  const handleSkip = async () => {
    const payload = new FormData();
    payload.append("displayname", displayName);
    await userMutation.mutateAsync(payload);
    setIsEdited(true);
    setOn(false);
    setOpenDialog(false);
    await queryClient.invalidateQueries(["users", "@me"]);
    await router.push("/profile/@me");
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
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
        {inProfileEdit && (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="mb-[5px] mt-[10px] w-[400px]">
              Two Factor Authentication is {otp ? <>Enabled</> : <>Disabled</>}{" "}
              now switch to {otp ? <>Disable</> : <>Enable</>}
            </Label>
            <Switch checked={otp} onCheckedChange={() => void toggleOtp()} />
          </div>
        )}
        {otp && (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <h1>Generate QR Code</h1>

            <QRCode value={qrCodeData} />
          </div>
        )}
        <div className="flex justify-between">
          <div className="mt-[20px] flex">
            <Button
              disabled={userMutation.isLoading}
              className="bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]"
              onClick={() => void handleSkip()}
            >
              {inProfileEdit ? <>Cancel</> : <>Skip</>}
            </Button>
          </div>
          <div className="mt-[20px] flex grow justify-end">
            <Button
              disabled={userMutation.isLoading}
              className="bg-gradient-to-r from-[#ABD9D980] to-[#8d8dda80]"
              onClick={() => void handleSubmit()}
            >
              {inProfileEdit ? <>Save changes</> : <>Submit</>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletion;
