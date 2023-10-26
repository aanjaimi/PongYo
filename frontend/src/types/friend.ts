import type { User } from "@/types/user";

export enum FriendShipStateEnum {
  NONE,
  BLOCKED,
  PENDING,
  ACCEPTED,
}

export type FriendShipState = keyof typeof FriendShipStateEnum;

export type FriendShip = {
  id: string;
  state: FriendShipState;
  user: User;
  userId: string;
  friend: User;
  friendId: string;
};