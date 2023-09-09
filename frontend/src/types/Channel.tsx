import type { User } from "./User";
import type { Message } from "./Message";

export enum ChatType {
  PUBLIC= 'public',
  PRIVATE= 'private',
  PROTECTED= 'protected',
}

export type Channel = {
  id: string
  name: string
  directMessage: boolean
  type: ChatType
  moderatorId: string
  createdAt: Date
	updatedAt: Date
  messages: Message[]
  members: User[]
  memberCount: number
  memberLimit: number
}