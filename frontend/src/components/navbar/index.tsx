import Search from "../search";
import { Bell, Rocket } from "lucide-react";

function NavBar() {
  return (
    <>
      <div className="flex h-16 items-center justify-between border-b p-4">
        <Rocket />
        <Search />
        <Bell />
      </div>
    </>
  );
}
export default NavBar;
