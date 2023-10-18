import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StateProvider } from "@/contexts/state-context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { useEffect } from "react";
import { SocketProvider } from "@/contexts/socket-context";

const queryClient = new QueryClient({});

const getCurrentUser = async () => {
  const resp = await fetcher.get<User>("/users/@me");
  return resp.data;
};

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    queryClient.prefetchQuery(["users", "@me"], getCurrentUser).catch(console.error);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <StateProvider>
        <SocketProvider>
          <Component {...pageProps} />
          <ReactQueryDevtools></ReactQueryDevtools>
        </SocketProvider>
      </StateProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
