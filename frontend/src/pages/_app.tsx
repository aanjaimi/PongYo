import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from "@/contexts/socket-context";
import { StateProvider } from "@/contexts/state-context";

const queryClient = new QueryClient({});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StateProvider>
        <SocketProvider>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </SocketProvider>
      </StateProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
