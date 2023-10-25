import React, { useState } from "react";
import { useStateContext } from "@/contexts/state-context";
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import ProfileContent from "@/components/Profile/ProfileContent";

const getUser = async (
  login: string,
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const resp = await fetcher.get<User>(`/users/${login}`);
  setIsEdited(resp.data.isCompleted);
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
  const [isEdited, setIsEdited] = useState(false);
  const { dispatch } = useStateContext();
  const userQurey = useQuery({
    queryKey: ["users", id],
    queryFn: ({ queryKey: [, id] }) => {
      return getUser(id!, setIsEdited);
    },
    retry: false,
    onSuccess: (data) => {
      dispatch({ type: "SET_USER", payload: data });
    },
    onError: (err) => {
      console.error(err);
      dispatch({ type: "SET_USER", payload: null });
      dispatch({ type: "SET_AUTH", payload: false });
    },
  });

  if (userQurey.isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center text-[40px] font-black">
        Loading...
      </div>
    );
  if (userQurey.isError) router.push("/").catch(console.error);

  return (
    <div className="flex h-screen w-screen flex-col overflow-auto">
      <ProfileContent
        user={userQurey.data!}
        isEdited={isEdited}
        setIsEdited={setIsEdited}
      />
    </div>
  );
}
