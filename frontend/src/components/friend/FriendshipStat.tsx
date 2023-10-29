import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  type FriendShip,
  FriendShipStatus,
  FriendShipStatusEnum,
} from "@/types/friend";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { User } from "@/types/user";
import { type AxiosError } from "axios";
import { useSocket } from "@/contexts/socket-context";
import {
  getFriendShip,
  type FriendshipStatusPair,
  type FriendshipActionFunc,
  callFriendshipAction,
  hashPair,
} from "./FriendshipMethods";
import { useRouter } from "next/router";
import { useStateContext } from "@/contexts/state-context";

export const getFriendShipStatus = (
  currUserId: string,
  friendShip: FriendShip
): FriendShipStatusEnum => {
  if (!friendShip || friendShip.state === FriendShipStatus.NONE)
    return FriendShipStatusEnum.NONE;

  friendShip.isOwner = currUserId === friendShip.userId;
  switch (friendShip.state) {
    case FriendShipStatus.BLOCKED:
      return friendShip.isOwner
        ? FriendShipStatusEnum.BLOCKED_BY_USER
        : FriendShipStatusEnum.BLOCKED_BY_FRIEND;
    case FriendShipStatus.PENDING:
      return friendShip.isOwner
        ? FriendShipStatusEnum.PENDING_BY_USER
        : FriendShipStatusEnum.PENDING_BY_FRIEND;
  }
  return FriendShipStatusEnum.ACCEPTED;
};

type FriendshipStatProps = {
  user: User;
};

const updateFriendShip = async (
  friendId: string,
  statusChange: FriendshipStatusPair
) => {
  const action: FriendshipActionFunc | undefined = callFriendshipAction.get(
    hashPair(statusChange)
  );
  return await action!(friendId);
};

const FriendshipStat = ({ user }: FriendshipStatProps) => {
  const router = useRouter();
  const { notifSocket } = useSocket();
  const {
    state: { user: currUser, auth_status },
  } = useStateContext();
  const [friendShipStatus, setFriendShipStatus] =
    useState<FriendShipStatusEnum>(() => FriendShipStatusEnum.NONE);

  const friendQuery = useQuery({
    queryKey: ["friends", user.id],
    retry: false,
    enabled: auth_status === "authenticated",
    queryFn: async ({ queryKey: [, id] }) => await getFriendShip(id!),
    onError: (err: AxiosError) => {
      if (err.response?.status === 404) {
        setFriendShipStatus(FriendShipStatusEnum.NONE);
      }
    },
    onSuccess: (data) => {
      setFriendShipStatus(getFriendShipStatus(currUser!.id, data));
    },
  });

  const friendMutation = useMutation({
    mutationKey: ["friends", user.id],

    mutationFn: (statusChange: FriendshipStatusPair) =>
      updateFriendShip(user.id, statusChange),
    onSuccess: (data) => {
      setFriendShipStatus(getFriendShipStatus(currUser!.id, data));
    },
  });

  const handleBlock = async () => {
    const oldStatus = friendShipStatus;
    const newStatus =
      oldStatus === FriendShipStatusEnum.BLOCKED_BY_USER
        ? FriendShipStatusEnum.NONE
        : FriendShipStatusEnum.BLOCKED_BY_USER;

    await friendMutation.mutateAsync([oldStatus, newStatus]);
  };

  const handleUpdate = async () => {
    const oldStatus = friendShipStatus;
    let newStatus: FriendShipStatusEnum;

    if (oldStatus === FriendShipStatusEnum.NONE) {
      newStatus = FriendShipStatusEnum.PENDING_BY_USER;
    } else if (oldStatus === FriendShipStatusEnum.PENDING_BY_USER) {
      newStatus = FriendShipStatusEnum.NONE;
    } else if (oldStatus === FriendShipStatusEnum.PENDING_BY_FRIEND) {
      newStatus = FriendShipStatusEnum.ACCEPTED;
    } else newStatus = FriendShipStatusEnum.NONE;

    await friendMutation.mutateAsync([oldStatus, newStatus]);
  };

  const handleCancel = async () => {
    await friendMutation.mutateAsync([
      FriendShipStatusEnum.PENDING_BY_FRIEND,
      FriendShipStatusEnum.NONE,
    ]);
  };

  useEffect(() => {
    notifSocket.on(
      "notification",
      async (data: { senderId: string; type: "BLOCKED" | "IGNORE" }) => {
        if (data.type === "BLOCKED") await router.push("/profile/@me");
        await friendQuery.refetch();
      }
    );

    return () => {
      notifSocket.off("notification");
    };
  }, [friendQuery, notifSocket, router]);

  return (
    <div className="mr-[10px] flex justify-around">
      {friendShipStatus !== FriendShipStatusEnum.BLOCKED_BY_USER && (
        <div className="ml-[15px] flex items-center">
          <Button
            disabled={friendQuery.isLoading || auth_status !== "authenticated"}
            className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]"
            onClick={() => void handleUpdate()}
          >
            {friendShipStatus === FriendShipStatusEnum.NONE && <>Add Friend</>}
            {friendShipStatus === FriendShipStatusEnum.PENDING_BY_FRIEND && (
              <>Accept Request</>
            )}
            {friendShipStatus === FriendShipStatusEnum.ACCEPTED && (
              <>Remove Friend</>
            )}
            {friendShipStatus === FriendShipStatusEnum.PENDING_BY_USER && (
              <>Cancel Request</>
            )}
          </Button>
        </div>
      )}
      {friendShipStatus === FriendShipStatusEnum.PENDING_BY_FRIEND && (
        <div className="ml-[15px] flex items-center">
          <Button
            disabled={friendQuery.isLoading || auth_status !== "authenticated"}
            className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]"
            onClick={() => void handleCancel()}
          >
            <>Cancel Request</>
          </Button>
        </div>
      )}
      <div className="ml-[15px] flex items-center">
        <Button
          disabled={friendQuery.isLoading || auth_status !== "authenticated"}
          className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]"
          onClick={() => void handleBlock()}
        >
          {friendShipStatus === FriendShipStatusEnum.BLOCKED_BY_USER ? (
            <>Unblock</>
          ) : (
            <>Block</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FriendshipStat;
