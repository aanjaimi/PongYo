import type { Message } from "./message";
import type { User } from "./user";

export enum ChatType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
}

export type ban = {
  id: string;
  userId: string;
  channelId: string;
  createdAt: Date;
  updatedAt: Date;
  bannedUntil: Date;
}

export type mute = {
  id: string;
  userId: string;
  channelId: string;
  createdAt: Date;
  updatedAt: Date;
  mutedUntil: Date;
}

export type Channel = {
  id: string;
  name: string;
  isDM: boolean;
  type: ChatType;
  moderators: User[];
  ownerId: string;
  owner: User;
  bans: ban[];
  mutes: mute[];
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  members: User[];
  msgNotification: boolean;
};