import React, { useEffect, useState } from "react";
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

const getUsersWithRank = async (
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  // const route = "/users/rank?rank=" + state.user?.rank;
  const route = "/users/all";
  const resp = await fetcher.get<User[]>(route);
  setUsers(resp.data);
  return resp.data;
};

const LeaderBoard = () => {
  // const { state } = useStateContext();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsersWithRank(setUsers);
  }, []);

  return (
    <div
      style={{ overflow: "auto", maxHeight: "359px" }}
      className="mx-[10px] mt-[10px] w-full"
    >
      <Table className="rounded-t-[15px] border-black bg-[#00000066]">
        <TableHeader>
          <TableRow className="mx-[10px] text-white text-xs font-semibold">
            <TableHead className="mx-[10px] text-white text-xs font-semibold">rank</TableHead>
            <TableHead className="mx-[10px] text-white text-xs font-semibold">player</TableHead>
            <TableHead className="mx-[10px] text-white text-xs font-semibold">w/l</TableHead>
            <TableHead className="mx-[10px] text-white text-xs font-semibold">rank</TableHead>
            <TableHead className="mx-[10px] text-white text-xs font-semibold">points</TableHead>
          </TableRow>
        </TableHeader>
        {users?.map((user, index) => {
          return (
            <TableBody key={user.id} className="mx-[10px] text-white text-sm font-semibold">
              <TableRow className="bg-[#D9D9D94D]">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.displayname}</TableCell>
                <TableCell>{user.vectories}/{user.defeats}</TableCell>
                <TableCell>{user.rank}</TableCell>
                <TableCell>{user.points}</TableCell>
              </TableRow>
            </TableBody>
          );
        })}
      </Table>
    </div>
  );
};

export default LeaderBoard;