import type { Achievements } from "./achievement";
import type { Game } from "./game";

enum Rank {
  UNRANKED,
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM,
  EMERALD,
  DIAMOND,
  MASTER,
  GRANDMASTER,
  LEGEND,
  CHAMPION,
}

enum UserStatus {
  ONLINE,
  OFFLINE,
  IN_GAME,
}

export type User = {
  id: string;
  displayname: string;
  login: string;
  email: string;
  rank: Rank;
  userStatus: UserStatus;
  vectories: number;
  defeats:   number;
  points:    number;
  rowvectories: number;
  isCompleted: boolean;
  twoFactorAuth: boolean;
  achievement: Achievements[];
  userGameHistory: Game[];
  createdAt: Date;
  updatedAt: Date;
  avatar: string;
};
