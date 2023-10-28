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

const getUsers = async () => {
  return (await fetcher.get<User[] | []>(`/users`)).data;
};

const LeaderBoard = () => {
  const router = useRouter();
  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => await getUsers(),
    onError: (error) => {
      console.log(error);
    },
  });

  if (userQuery.isLoading) return <Loading />;

  if (userQuery.isError) void router.push("/404");

  return (
    <div
      style={{ overflow: "auto", maxHeight: "359px" }}
      className="mx-[10px] mt-[10px] w-full"
    >
      <Table className="rounded-t-[15px] border-black bg-[#00000066]">
        <TableHeader>
          <TableRow className="mx-[10px] text-xs font-semibold text-white">
            <TableHead className="mx-[10px] text-xs font-semibold text-white">
              rank
            </TableHead>
            <TableHead className="mx-[10px] text-xs font-semibold text-white">
              player
            </TableHead>
            <TableHead className="mx-[10px] text-xs font-semibold text-white">
              w/l
            </TableHead>
            <TableHead className="mx-[10px] text-xs font-semibold text-white">
              rank
            </TableHead>
            <TableHead className="mx-[10px] text-xs font-semibold text-white">
              points
            </TableHead>
          </TableRow>
        </TableHeader>
        {userQuery.data?.map((user, index) => {
          return (
            <TableBody
              key={user.id}
              className="mx-[10px] text-sm font-semibold text-white"
            >
              <TableRow className="bg-[#D9D9D94D]">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.displayname}</TableCell>
                <TableCell>
                  {user.stat.vectories}/{user.stat.defeats}
                </TableCell>
                <TableCell>{user.stat.rank}</TableCell>
                <TableCell>{user.stat.points}</TableCell>
              </TableRow>
            </TableBody>
          );
        })}
      </Table>
    </div>
  );
};

export default LeaderBoard;
