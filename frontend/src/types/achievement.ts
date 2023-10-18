import type { CommonDate } from "./common";
import type { User } from "./user";

export type Achievements = {
  id: string;
  name: string;
  description: string;
  icon: string;
  userId: string;
};