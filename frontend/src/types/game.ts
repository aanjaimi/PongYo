// enum Mode {
//   CLASSIC,
//   RANKED,
// }

export type Game = {
  id: string;
  // mode: Mode;
  opponentId: string;
  oppositeId: string;
  opponentScore: number;
  oppositeScore: number;
  opponentstatus: boolean;
  oppositestatus: boolean;
};