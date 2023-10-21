import type { User } from './User';
import type { Message } from './Message';

export enum ChatType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
}

export type Channel = {
  id: string;
  name: string;
  isDM: boolean;
  type: ChatType;
  moderators: User[];
  ownerId: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  members: User[];
  msgNotification: boolean;
};
