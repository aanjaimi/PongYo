import type { Achievements } from "./achievement";
import type { Game } from "./game";

export type User = {
  id: string;
  displayname: string;
  login: string;
  email: string;
  userStatus: string; // TODO: should be enum !
  achievements: Achievements[];
  oppositeGames: Game[];
  createdAt: Date;
  updatedAt: Date;
};
