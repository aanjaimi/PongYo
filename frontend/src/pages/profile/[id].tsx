import React from "react";
import { useStateContext } from "@/contexts/state-context";
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Body from "@/components/Body";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Editpage from "@/components/Editpage";
import TFA from "@/components/TFA";
import { useQueryClient } from "@tanstack/react-query";

const getUser = async (login: string) => {
  const resp = await fetcher.get<User>(`/users/${login}`);
  return resp.data;
};

export type ProfileProps = {
  id: string;
};
export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { id } = context.params as { id: string };

  return {
    props: {
      id,
    },
  };
};

export default function Profile({ id }: ProfileProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { dispatch } = useStateContext();
  const userQurey = useQuery({
    queryKey: ["users", id],
    queryFn: ({ queryKey: [, id] }) => {
      return getUser(id!);
    },
    // retry: true,
    onSuccess: (data) => {
      dispatch({ type: "SET_USER", payload: data });
      queryClient.invalidateQueries(["users", "@me"]).catch(console.error);
    },
    onError: (err) => {
      console.error(err);
      dispatch({ type: "SET_USER", payload: null });
    },
  });

  if (userQurey.isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center text-[40px] font-black">
        Loading...
      </div>
    );
  if (userQurey.isError) router.push("/").catch(console.error);
  const user = userQurey.data;

  return (
    <div className="flex h-screen w-screen flex-col overflow-auto">
      {user?.isCompleted && (
        <>
          {!user.twoFactorAuth && (
            <>
              <Navbar />
              <Body />
            </>
          )}
          {user.twoFactorAuth && <div className="w-screen h-screen flex items-center justify-center"><TFA /></div>}
        </>
      )}
      {!user?.isCompleted && <Editpage />}
    </div>
  );
}
