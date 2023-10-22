import { env } from "@/env.mjs";
import axios from "axios";

export const fetcher = axios.create({
  withCredentials: true,
  baseURL: env.NEXT_PUBLIC_BACKEND_ORIGIN,
});
