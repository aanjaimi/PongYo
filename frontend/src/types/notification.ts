import { type CommonDate } from "./common";
import { type User } from "./user";

export type NotifType = "FRIEND_REQUEST" | "FRIEND_ACCEPT" | "GAME_REQUEST";

export type Notification = {
  id: string;
  sender: User;
  type: NotifType;
  content: object;
} & CommonDate;
