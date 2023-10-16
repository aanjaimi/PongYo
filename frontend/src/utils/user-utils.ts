import { type User } from "@/types/user";
import { fetcher } from "./fetcher";

export const getCurrentUser = async () => {
  // TODO: change it later!
  return (await fetcher<User>("/auth/me")).data;
};
