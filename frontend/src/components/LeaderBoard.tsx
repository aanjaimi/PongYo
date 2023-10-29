import React from "react";
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/pages/Loading";
import { useRouter } from "next/router";
import type { ApiResponse } from "@/types/common";
import { EmptyView } from "./empty";

const getUsers = async (page = 0) => {
  return (await fetcher.get<ApiResponse<User[]>>(`/users`, {
    params: { page },
  })).data;
};

const LeaderBoard = () => {
  const router = useRouter();
  const leaderBoardQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => getUsers(),
  });

  if (leaderBoardQuery.isLoading) return <Loading />;

  if (leaderBoardQuery.isError) return void router.push("/404");

  const users = leaderBoardQuery.data?.data;

  return (
    <div
      style={{ overflow: "auto", maxHeight: "359px" }}
      className="mx-[10px] mt-[10px] w-full"
    >
      <Table className="rounded-t-[15px] border-black">
        <TableHeader>
          <TableRow className="mx-[10px] text-xs font-semibold text-black">
            <TableHead className="mx-[10px] text-xs font-semibold text-black">
              rank
            </TableHead>
            <TableHead className="mx-[10px] text-xs font-semibold text-black">
              player
            </TableHead>
            <TableHead className="mx-[10px] text-xs font-semibold text-black">
              w/l
            </TableHead>
            <TableHead className="mx-[10px] text-xs font-semibold text-black">
              rank
            </TableHead>
            <TableHead className="mx-[10px] text-xs font-semibold text-black">
              points
            </TableHead>
          </TableRow>
        </TableHeader>
        {!users?.length && (
          <EmptyView
            title="No notifications"
            message="You don't have any notifications yet"
          ></EmptyView>
        )}
        {users?.map((user, index) => {
          return (
            <TableBody
              key={user.id}
              className="mx-[10px] text-sm font-semibold text-black"
            >
              <TableRow>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.displayname}</TableCell>
                <TableCell>
                  {user.stat?.vectories}/{user.stat?.defeats}
                </TableCell>
                <TableCell>{user.stat?.rank}</TableCell>
                <TableCell>{user.stat?.points}</TableCell>
              </TableRow>
            </TableBody>
          );
        })}
      </Table>
    </div>
  );
};

export default LeaderBoard;