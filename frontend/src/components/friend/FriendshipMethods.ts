import { fetcher } from "@/utils/fetcher";
import type { FriendShip } from "@/types/friend";
import { FriendShipStatusEnum } from "@/types/friend";

export type FriendshipActionFunc = (arg: string) => Promise<FriendShip>;

export type FriendshipStatusPair = [FriendShipStatusEnum, FriendShipStatusEnum];

export const hashPair = (pair: FriendshipStatusPair) => {
  return pair.join(" <-> ");
}

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

export const callFriendshipAction = new Map<
  string,
  FriendshipActionFunc
>( [
  [hashPair([ FriendShipStatusEnum.NONE, FriendShipStatusEnum.PENDING_BY_USER]), sentFriendRequest],
  [hashPair([ FriendShipStatusEnum.NONE, FriendShipStatusEnum.BLOCKED_BY_USER]), blockFriend],
  [hashPair([ FriendShipStatusEnum.PENDING_BY_USER, FriendShipStatusEnum.NONE]), cancelFriendRequest],
  [hashPair([ FriendShipStatusEnum.PENDING_BY_USER, FriendShipStatusEnum.BLOCKED_BY_USER]), blockFriend],
  [hashPair([ FriendShipStatusEnum.PENDING_BY_FRIEND, FriendShipStatusEnum.ACCEPTED]), acceptFriendRequest],
  [hashPair([ FriendShipStatusEnum.PENDING_BY_FRIEND, FriendShipStatusEnum.NONE]), cancelFriendRequest],
  [hashPair([ FriendShipStatusEnum.PENDING_BY_FRIEND, FriendShipStatusEnum.BLOCKED_BY_USER]), blockFriend],
  [hashPair([ FriendShipStatusEnum.BLOCKED_BY_USER, FriendShipStatusEnum.NONE]), unblockFriend],
  [hashPair([ FriendShipStatusEnum.ACCEPTED, FriendShipStatusEnum.NONE]), removeFriend],
  [hashPair([ FriendShipStatusEnum.ACCEPTED, FriendShipStatusEnum.BLOCKED_BY_USER]), blockFriend],
  [hashPair([ FriendShipStatusEnum.ACCEPTED, FriendShipStatusEnum.BLOCKED_BY_USER]), blockFriend],
]);