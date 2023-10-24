import { type User } from "@/types/user";
import { fetcher } from "./fetcher";

export const getCurrentUser = async (auth: false | true | "otp") => {
  // TODO: change it later!
  return (await fetcher<User>(`/${auth == "otp" ? "auth" : "users"}/@me`)).data;
};
