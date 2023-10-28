import type { User } from "@/types/user";

export enum FriendShipStatus {
  NONE = "NONE",
  BLOCKED = "BLOCKED",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

export enum FriendShipStatusEnum {
  NONE = "NONE",
  BLOCKED_BY_FRIEND = "BLOCKED_BY_FRIEND",
  BLOCKED_BY_USER = "BLOCKED_BY_USER",
  PENDING_BY_FRIEND = "PENDING_BY_FRIEND",
  PENDING_BY_USER = "PENDING_BY_USER",
  ACCEPTED = "ACCEPTED",
}

export type FriendShip = {
  id: string;
  state: FriendShipStatus;
  user: User;
  userId: string;
  friend: User;
  friendId: string;
  isOwner: boolean;
};
