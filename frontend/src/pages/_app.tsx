import { useEffect } from "react";
import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from "@/contexts/socket-context";
import { StateProvider } from "@/contexts/state-context";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";
import Layout from "@/components/layout";

const queryClient = new QueryClient({});

const getCurrentUser = async () => {
  const resp = await fetcher.get<User>("/users/@me");
  return resp.data;
}

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    queryClient.prefetchQuery(["users", "@me"], getCurrentUser).catch(console.error);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <StateProvider>
        <SocketProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </SocketProvider>
      </StateProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
