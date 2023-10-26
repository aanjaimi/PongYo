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

export type Stat = {
  vectories: number;
  defeats: number;
  points: number;
  rowvectories: number;
  rank: Rank;
}