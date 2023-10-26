import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { FriendShip, FriendShipState } from "@/types/friend";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";
import { type AxiosError } from "axios";
import { useStateContext } from "@/contexts/state-context";
import { get } from "http";
import { useSocket } from "@/contexts/socket-context";

// import { useRouter } from "next/router";

// friends flow:
/**
 * - get friendship: [GET]/friends/:id
 * - send friend request: [POST]/friends/:id
 * - accept friend request: [PATCH]/friends/:id?action=ACCEPT
 * - cancel friend request: [PATCH]/friends/:id?action=CANCEL
 * - unblock friend : [PATCH]/friends/:id?action=UNBLOCK
 * - block friend: [DELETE]/friends/:id
 */

enum FriendShipStatusEnum {
  NONE,
  BLOCKED_BY_FRIEND, // howa li 3ml block
  BLOCKED_BY_USER, // ana li 3mlt block
  PENDING_BY_FRIEND, // howa li 3ml add
  PENDING_BY_USER, // ana li 3mlt add
  ACCEPTED,
}

export type FriendShipStatus = keyof typeof FriendShipStatusEnum;

export const getFriendShipStatus = (
  userId: string,
  friendShip: FriendShip
): FriendShipStatus => {
  if (!friendShip || friendShip.state === "NONE") return "NONE";

  const userSide = userId === friendShip.userId;

  switch (friendShip.state) {
    case "BLOCKED":
      return userSide ? "BLOCKED_BY_USER" : "BLOCKED_BY_FRIEND";
    case "PENDING":
      return userSide ? "PENDING_BY_USER" : "PENDING_BY_FRIEND";
  }
  return friendShip.state;
};

type FriendshipStatProps = {
  user: User;
};

export const getFriendShip = async (id: string) => {
  return (await fetcher.get<FriendShip>(`/friends/${id}`)).data;
};

export const sentFriendRequest = async (id: string) => {
  return (await fetcher.post<FriendShip>(`/friends/${id}`)).data;
};

export const acceptFriendRequest = async (id: string) => {
  return (await fetcher.patch<FriendShip>(`/friends/${id}?action=ACCEPT`)).data;
};
export const removeFriend = async (id: string) => {
  return (await fetcher.patch<FriendShip>(`/friends/${id}?action=UNFRIEND`))
    .data;
};

export const cancelFriendRequest = async (id: string) => {
  return (await fetcher.patch<FriendShip>(`/friends/${id}?action=CANCEL`)).data;
};

export const unblockFriend = async (id: string) => {
  return (await fetcher.patch<FriendShip>(`/friends/${id}?action=UNBLOCK`))
    .data;
};

export const blockFriend = async (id: string) => {
  return (await fetcher.delete<FriendShip>(`/friends/${id}`)).data;
};

const updateFriendShip = async (
  userId: string,
  id: string,
  friendShip: FriendShip,
  fromBlock: boolean
) => {
  const dp: Record<
    Exclude<FriendShipStatus, "BLOCKED_BY_FRIEND">,
    (id: string) => Promise<FriendShip>
  > = {
    NONE: fromBlock ? blockFriend : sentFriendRequest,
    PENDING_BY_FRIEND: acceptFriendRequest,
    PENDING_BY_USER: cancelFriendRequest,
    BLOCKED_BY_USER: unblockFriend,
    ACCEPTED: fromBlock ? blockFriend : removeFriend,
  };

  const status = getFriendShipStatus(userId, friendShip) as Exclude<
    FriendShipStatus,
    "BLOCKED_BY_FRIEND"
  >;

  return await dp[status](id);
};

const FriendshipStat = ({ user }: FriendshipStatProps) => {
  const { state } = useStateContext();
  const { chatSocket } = useSocket();
  const [friendShip, setFriendShip] = useState<FriendShip>(() => ({
    id: "",
    state: "NONE",
    userId: state.user!.id,
    friendId: user.id,
    user: state.user!,
    friend: user,
  }));

  const friendQeury = useQuery({
    queryKey: ["friends", user.id],
    retry: false,
    queryFn: async ({ queryKey: [, id] }) => await getFriendShip(id!),
    onError: (err: AxiosError) => {
      console.log(err);
    },
    onSuccess: (data) => {
      setFriendShip(data);
    },
  });

  const friendMutation = useMutation({
    mutationKey: ["friends", user.id],
    mutationFn: async (fromBlock: boolean) =>
      updateFriendShip(state.user!.id, user.id, friendShip, fromBlock),
    onSuccess: (data) => {
      setFriendShip(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const actionContnet: Record<FriendShipStatus, string> = {
    NONE: "Add Friend",
    PENDING_BY_FRIEND: "Accept Request",
    PENDING_BY_USER: "Cancel Request",
    BLOCKED_BY_FRIEND: "Unblock",
    BLOCKED_BY_USER: "Unblock",
    ACCEPTED: "Remove Friend",
  };

  useEffect(() => {
    chatSocket.on("notifications", async () => {
      await friendQeury.refetch();
    });

    return () => {
      chatSocket.off("friendship");
    };
  });

  return (
    <div className="mr-[10px] flex justify-around">
      {friendShip.state !== "BLOCKED" && (
        <div className="ml-[15px] flex items-center">
          <Button
            className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]"
            onClick={() => void friendMutation.mutateAsync(false)}
          >
            {actionContnet[getFriendShipStatus(state.user!.id, friendShip)]}
          </Button>
        </div>
      )}
      {getFriendShipStatus(state.user!.id, friendShip) ===
        "PENDING_BY_FRIEND" && (
        <div className="ml-[15px] flex items-center">
          <Button
            className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]"
            onClick={() => void friendMutation.mutateAsync(true)}
          >
            <>Cancel Request</>
          </Button>
        </div>
      )}
      <div className="ml-[15px] flex items-center">
        <Button
          className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]"
          onClick={() => void friendMutation.mutateAsync(true)}
        >
          {getFriendShipStatus(state.user!.id, friendShip) ===
          "BLOCKED_BY_USER" ? (
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
