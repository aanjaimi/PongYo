import type { Message } from "./message";
import type { User } from "./user";

export enum ChatType {
  PUBLIC = "public",
  PRIVATE = "private",
  PROTECTED = "protected",
}

export type Channel = {
  id: string;
  name: string;
  type: ChatType;
  moderatorId: string;
  createdAt: Date;
  messages: Message[];
  members: User[];
  memberCount: number;
  memberLimit: number;
};