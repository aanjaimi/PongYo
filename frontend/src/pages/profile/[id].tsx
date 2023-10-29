import React, { useState } from 'react';
import type { User } from '@/types/user';
import { fetcher } from '@/utils/fetcher';
import type { GetServerSidePropsContext } from 'next';
import ProfileContent from '@/components/Profile/ProfileContent';
import { ToastContainer } from 'react-toastify';
import { env } from '@/env.mjs';

export type ProfileProps = {
  user: User;
};
export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { id } = context.params as { id: string };
  try {
    const cookie = context.req.headers.cookie;
    const user = (
      await fetcher.get<User>(`/users/${id}`, {
        baseURL: `${env.NEXT_PUBLIC_DOCKER_BACKEND_ORIGIN}/api/`,
        headers: {
          Cookie: cookie ?? '',
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
        destination: '/404',
        permanent: false,
      },
    };
  }
};

export default function Profile({ user }: ProfileProps) {
  const [isEdited, setIsEdited] = useState(user.isCompleted);

  return (
    <div className="flex h-full w-full flex-grow flex-col">
      <ProfileContent
        user={user}
        isEdited={isEdited}
        setIsEdited={setIsEdited}
      />
      <ToastContainer />
    </div>
  );
}
