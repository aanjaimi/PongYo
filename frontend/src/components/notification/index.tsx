import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSocket } from "@/contexts/socket-context";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";

import Link from "next/link";
import Image from "next/image";
import type { NotifType, Notification } from "@/types/notification";
import type { ApiResponse } from "@/types/common";
import { EmptyView } from "../empty";

const getNotifications = async (page = 0) => {
  return (
    await fetcher.get<ApiResponse<Notification[]>>(`/notifications`, {
      params: { page },
    })
  ).data;
};

export function Notifications() {
  const notificationQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => getNotifications(),
  });

  const { chatSocket: socket } = useSocket();
  useEffect(() => {
    socket.on("notification", async () => {
      await notificationQuery.refetch();
    });

    return () => {
      socket.off("notification");
    };
  });

  const notifTypeMessages: Record<NotifType, string> = {
    FRIEND_REQUEST: "sends a friend request",
    FRIEND_ACCEPT: "accepts your friend request",
    GAME_REQUEST: "sends a game invite",
  };

  if (notificationQuery.isLoading) return <>Loading</>;
  if (notificationQuery.isError) return <>Error</>;

  const notifications = notificationQuery.data.data;

  return (
    <Card className="flex flex-col items-center justify-center">
      <CardHeader className="pb-3">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>all notifications</CardDescription>
      </CardHeader>
      <CardContent className="grid w-[400px] gap-1 overflow-auto">
        {!notifications.length && (
          <EmptyView
            title="No notifications"
            message="You don't have any notifications yet"
          ></EmptyView>
        )}

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <Image
              className="h-10 w-10 rounded-full"
              src={notification.sender.avatar.path}
              alt="awbx's image"
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
      </CardContent>
    </Card>
  );
}
