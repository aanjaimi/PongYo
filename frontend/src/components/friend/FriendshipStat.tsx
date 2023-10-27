import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  type FriendShip,
  FriendShipStatus,
  FriendShipStatusEnum,
} from "@/types/friend";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";
import { type AxiosError } from "axios";
import { useStateContext } from "@/contexts/state-context";
import { useSocket } from "@/contexts/socket-context";
import { set } from "zod";

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

export const getFriendShipStatus = (
  userId: string,
  friendShip: FriendShip
): FriendShipStatusEnum => {
  if (!friendShip || friendShip.state === FriendShipStatus.NONE)
    return FriendShipStatusEnum.NONE;

  const userSide = userId === friendShip.userId;

  switch (friendShip.state) {
    case FriendShipStatus.BLOCKED:
      return userSide
        ? FriendShipStatusEnum.BLOCKED_BY_USER
        : FriendShipStatusEnum.BLOCKED_BY_FRIEND;
    case FriendShipStatus.PENDING:
      return userSide
        ? FriendShipStatusEnum.PENDING_BY_USER
        : FriendShipStatusEnum.PENDING_BY_FRIEND;
  }
  return FriendShipStatusEnum.ACCEPTED;
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
  friendShipStatus: FriendShipStatusEnum,
  id: string,
  setFriendShipStatus: React.Dispatch<React.SetStateAction<FriendShipStatusEnum>>
): Promise<FriendShip> => {
  console.log('friendShipStatusss1: ', friendShipStatus);
  if (friendShipStatus === FriendShipStatusEnum.NONE) {
    setFriendShipStatus(FriendShipStatusEnum.PENDING_BY_USER);
    console.log('friendShipStatusss2: ', friendShipStatus);
    return await sentFriendRequest(id);
  }
  if (friendShipStatus === FriendShipStatusEnum.BLOCKED_BY_USER) {
    setFriendShipStatus(FriendShipStatusEnum.NONE);
    return await unblockFriend(id);
  }
  if (friendShipStatus === FriendShipStatusEnum.PENDING_BY_USER) {
    setFriendShipStatus(FriendShipStatusEnum.NONE);
    return await cancelFriendRequest(id);
  }
  if (friendShipStatus === FriendShipStatusEnum.PENDING_BY_FRIEND) {
    setFriendShipStatus(FriendShipStatusEnum.ACCEPTED);
    return await acceptFriendRequest(id);
  }
  if (friendShipStatus === FriendShipStatusEnum.ACCEPTED) {
    setFriendShipStatus(FriendShipStatusEnum.NONE);
    return await removeFriend(id);
  }
  setFriendShipStatus(FriendShipStatusEnum.BLOCKED_BY_USER);
  return await blockFriend(id);
};

const FriendshipStat = ({ user }: FriendshipStatProps) => {
  const { state } = useStateContext();
  const { chatSocket } = useSocket();
  const [friendShip, setFriendShip] = useState<FriendShip | undefined>(
    undefined
  );
  const [friendShipStatus, setFriendShipStatus] =
    useState<FriendShipStatusEnum>(FriendShipStatusEnum.NONE);

  const friendQeury = useQuery({
    queryKey: ["friends", user.id],
    retry: false,
    queryFn: async ({ queryKey: [, id] }) => await getFriendShip(id!),
    onError: (err: AxiosError) => {
      console.log(err);
    },
    onSuccess: (data) => {
      setFriendShip(data);
      setFriendShipStatus(getFriendShipStatus(user.id, data));
    },
  });

  const friendMutation = useMutation({
    mutationKey: ["friends", user.id],
    mutationFn: () => updateFriendShip(friendShipStatus, user.id, setFriendShipStatus),
    onSuccess: (data) => {
      console.log('data: ', data);
      setFriendShip(data);
      console.log('friendShipStatus: ', getFriendShipStatus(user.id, data));
      setFriendShipStatus(getFriendShipStatus(user.id, data));
    },
    onError: (err) => {
      console.log(err);
    },
  });

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
      {friendShipStatus !== FriendShipStatusEnum.BLOCKED_BY_USER && (
        <div className="ml-[15px] flex items-center">
          <Button
            className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]"
            onClick={() => void friendMutation.mutateAsync()}
          >
            {friendShipStatus === FriendShipStatusEnum.NONE && <>Add Friend</>}
            {friendShipStatus === FriendShipStatusEnum.PENDING_BY_FRIEND && <>Accept Request</>}
            {friendShipStatus === FriendShipStatusEnum.ACCEPTED && <>Remove Friend</>}
            {friendShipStatus === FriendShipStatusEnum.PENDING_BY_USER && <>Cancel Request</>}
          </Button>
        </div>
      )}
      {friendShipStatus === FriendShipStatusEnum.PENDING_BY_USER && (
        <div className="ml-[15px] flex items-center">
          <Button
            className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]"
            onClick={() => void friendMutation.mutateAsync()}
          >
            <>Cancel Request</>
          </Button>
        </div>
      )}
      <div className="ml-[15px] flex items-center">
        <Button
          className="bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]"
          onClick={() => void friendMutation.mutateAsync()}
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
