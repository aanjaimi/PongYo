import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
    queryClient.prefetchQuery(["users"], getCurrentUser).catch(console.error);
  }, []);
  return (
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SocketProvider>
  );
};

export default MyApp;
