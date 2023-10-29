import type { User } from "@/types/user";

export enum FriendState {
  NONE,
  BLOCKED,
  PENDING,
  ACCEPTED,
  REFUSED,
}

export type FriendShip = {
  id: number;
  state: FriendState;
  user: User;
  userId: string;
  friend: User;
  friendId: string;
};