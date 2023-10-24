import type { Achievements } from "./achievement";
import type { Game } from "./game";

export enum Rank {
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

export enum UserStatus {
  ONLINE,
  OFFLINE,
  IN_GAME,
}

export enum TwoFactorStatus {
  ENABLED,
  DISABLED,
  NOT_SET,
}

export type User = {
  id: string;
  displayname: string;
  login: string;
  email: string;
  rank: Rank;
  userStatus: UserStatus;
  vectories: number;
  defeats: number;
  points: number;
  rowvectories: number;
  isCompleted: boolean;
  achievement: Achievements[];
  userGameHistory: Game[];
  totp: {
    enabled: boolean;
  } & {
    enabled: true;
    otpauth_url: string;
  };
  createdAt: Date;
  updatedAt: Date;
  avatar: {
    minio: boolean;
    path: string;
  };
};
