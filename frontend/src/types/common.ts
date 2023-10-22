export enum Buttons {
  PROFILE = "Profile",
  GAME = "Game",
  FRIENDS = "Friends",
  CHAT = "Chat",
  PARAM = "Param",
}

export type CommonDate = {
  createAt: Date;
  updateAt: Date;
};

export type ApiResponse<T> = {
  data: T;
  limit: number;
  pages: number;
};
