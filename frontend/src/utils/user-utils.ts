import { type User } from "@/types/user";
import { fetcher } from "./fetcher";

export const getCurrentUser = async () => {
  return (await fetcher<User>(`/users/@me`)).data;
};
