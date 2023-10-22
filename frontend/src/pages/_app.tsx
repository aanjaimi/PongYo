import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StateProvider } from "@/contexts/state-context";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { useEffect } from "react";
import { SocketProvider } from "@/contexts/socket-context";

const queryClient = new QueryClient({});

const getCurrentUser = async () => {
  const res = await fetcher<User>("/users/@me");
  return res;
}

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    queryClient.prefetchQuery(["users", "@me"], getCurrentUser).catch(console.error);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <StateProvider>
          <Component {...pageProps} />
          {/* <ReactQueryDevtools></ReactQueryDevtools> */}
        </StateProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
