import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import Loading from '@/pages/Loading';
import { type ApiResponse } from '@/types/common';
import type { User } from '@/types/user';
import { fetcher } from '@/utils/fetcher';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { EmptyView } from '../empty';
import { useStateContext } from '@/contexts/state-context';
import React from 'react';
import Link from 'next/link';

const getFriendRequests = async (page = 0) => {
  return (
    await fetcher.get<
      ApiResponse<Pick<User, 'displayname' | 'avatar' | 'id' | 'login'>[]>
    >(`/friends?state=PENDING`, {
      params: { page, limit: 1 },
    })
  ).data;
};

const FriendRequests = () => {
  const router = useRouter();
  const { state } = useStateContext();
  const friendQuery = useInfiniteQuery(
    ['friends-pending'],
    ({ pageParam = 0 }) => getFriendRequests(pageParam as number),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.data.length < lastPage.limit) return null;
        return pages.length;
      },
      enabled: state.auth_status === 'authenticated',
    },
  );

  if (friendQuery.isLoading) return <Loading />;

  if (friendQuery.isError) return void router.push('/404');

  const pages = friendQuery.data.pages;

  return (
    <Card className="h-[50%] w-[30%]">
      <CardHeader>
        <CardTitle className="flex justify-center capitalize">friend requests</CardTitle>
      </CardHeader>
      <CardContent className="grid max-h-[calc(100%-72px)] gap-6 overflow-y-auto">
        {!pages[0]?.data.length && (
          <EmptyView
            title="No Friend Request"
            message="You don't have any friends request yet"
          ></EmptyView>
        )}

        {pages.map((page, idx) => (
          <React.Fragment key={idx}>
            {page.data.map((friend) => (
              <Link key={friend.login} href={`/profile/${friend.id}`}>
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={friend.avatar.path} />
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {friend.displayname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {friend.login}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </React.Fragment>
        ))}

        {friendQuery.hasNextPage && (
          <Button
            onClick={() => void friendQuery.fetchNextPage()}
            disabled={friendQuery.isFetchingNextPage}
          >
            {friendQuery.isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
export default FriendRequests;
