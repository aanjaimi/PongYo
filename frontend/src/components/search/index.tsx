import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";
import SearchList from "../SearchList";

const getUsers = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setUsers: React.Dispatch<React.SetStateAction<[] | User[]>>
) => {
  e.preventDefault();
  const resp = await fetcher.get<User[]>(`/users?query=${e.target.value}`);
  setUsers(resp.data);
};

function Search() {
  const [users, setUsers] = useState<User[] | []>([]);

  return (
    <div>
      <Input
        className="w-[300px] sm:w-[400px]"
        type="search"
        placeholder="Search..."
        onChange={(e) => {
          getUsers(e, setUsers).catch((err) => console.error(err));
        }}
      />
      {users.length > 0 && <SearchList users={users}/>}
    </div>
  );
}

export default Search;
