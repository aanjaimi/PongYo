import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSocket } from '@/contexts/socket-context';
import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetcher';

import Link from 'next/link';
import Image from 'next/image';
import type { NotifType, Notification } from '@/types/notification';
import type { ApiResponse } from '@/types/common';
import { EmptyView } from '../empty';
import Loading from '@/pages/Loading';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';

const getNotifications = async (page = 0) => {
  return (
    await fetcher.get<ApiResponse<Notification[]>>(`/notifications`, {
      params: { page, limit: 2 },
    })
  ).data;
};

export function Notifications() {
  const router = useRouter();
  const notificationQuery = useInfiniteQuery(
    ['notifications'],
    async ({ pageParam = 0 }) => {
      return getNotifications(pageParam as number);
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.data.length < lastPage.limit) return null;
        return pages.length;
      },
    },
  );

  const { notifSocket } = useSocket();
  useEffect(() => {
    notifSocket.on('notification', async () => {
      await notificationQuery.refetch();
    });

    return () => {
      notifSocket.off('notification');
    };
  }, [notifSocket, notificationQuery]);

  const notifTypeMessages: Record<NotifType, string> = {
    FRIEND_REQUEST: 'sends a friend request',
    FRIEND_ACCEPT: 'accepts your friend request',
    GAME_REQUEST: 'sends a game invite',
  };

  if (notificationQuery.isLoading) return <Loading />;
  if (notificationQuery.isError) return void router.push('/404');

  const pages = notificationQuery.data.pages;

  return (
    <Card className="flex flex-col items-center justify-center border">
      <CardHeader className="pb-3">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>all notifications</CardDescription>
      </CardHeader>
      <CardContent className="grid h-[200px] w-[200px] gap-1 overflow-y-scroll sm:w-[400px]">
        {!pages[0]?.data.length && (
          <EmptyView
            title="No notifications"
            message="You don't have any notifications yet"
          ></EmptyView>
        )}

        {pages.map((page, idx) => (
          <React.Fragment key={idx}>
            {page.data.map((notification) => (
              <div
                key={notification.id}
                className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground"
              >
                <Image
                  className="h-10 w-10 rounded-full"
                  src={notification.sender.avatar.path}
                  alt={`${notification.sender.login}'s image`}
                  width={100}
                  height={100}
                ></Image>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.sender.displayname}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between gap-1">
                      <Link href={`/profile/${notification.sender.login}`}>
                        @{notification.sender.login}
                      </Link>
                      <p>{notifTypeMessages[notification.type]}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}

        {notificationQuery.hasNextPage && (
          <Button
            onClick={() => void notificationQuery.fetchNextPage()}
            disabled={notificationQuery.isFetchingNextPage}
          >
            {notificationQuery.isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
