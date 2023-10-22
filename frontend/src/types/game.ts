enum Mode {
  CLASSIC,
  RANKED,
}

export type Game = {
  id: string;
  mode: Mode;
  opponentId: string;
  oppositeId: string;
  oppnentScore: number;
  userScore: number;
  opponentStatus: boolean;
  userStatus: boolean;
};