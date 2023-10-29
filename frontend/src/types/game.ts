import type { User } from "./user";

enum Mode {
  CLASSIC,
  RANKED,
}

export type Game = {
  id: string;
  mode: Mode;
  userId: string;
  opponentId: string;
  user: User;
  opponent: User;
  oppnentScore: number;
  userScore: number;
  opponentStatus: boolean;
  userStatus: boolean;
};