import React, { useState } from "react";
import { useStateContext } from "@/contexts/state-context";
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import ProfileContent from "@/components/Profile/ProfileContent";
import { Axios, AxiosError } from "axios";

const getUser = async (login: string) => {
  const resp = await fetcher.get<User>(`/users/${login}`);
  return resp.data;
};

export type ProfileProps = {
  user: User;
};
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.params as { id: string };
  try {
    const cookie = context.req.headers.cookie;
    const user = (
      await fetcher.get<User>(`/users/${id}`, {
        headers: {
          Cookie: cookie ?? "",
        },
      })
    ).data;
    return {
      props: {
        user,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

export default function Profile({ user }: ProfileProps) {
  const [isEdited, setIsEdited] = useState(user.isCompleted);

  return (
    <div className="flex h-screen w-screen flex-col overflow-auto">
      <ProfileContent
        user={user}
        isEdited={isEdited}
        setIsEdited={setIsEdited}
      />
    </div>
  );
}
