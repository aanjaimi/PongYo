import type { User } from "@/types/user";

export enum FriendShipStatus {
  NONE,
  BLOCKED,
  PENDING,
  ACCEPTED,
}

export enum FriendShipStatusEnum {
  NONE,
  BLOCKED_BY_FRIEND, // howa li 3ml block
  BLOCKED_BY_USER, // ana li 3mlt block
  PENDING_BY_FRIEND, // howa li 3ml add
  PENDING_BY_USER, // ana li 3mlt add
  ACCEPTED,
}

export type FriendShip = {
  id: string;
  state: FriendShipStatus;
  user: User;
  userId: string;
  friend: User;
  friendId: string;
};