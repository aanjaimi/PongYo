import { GroupIcon, MessageSquare, User } from "lucide-react";

export function Sidebar() {
  return (
    <div className="flex h-full w-16 flex-col items-center gap-16 border-r p-4">
      <User />
      <MessageSquare />
      <GroupIcon />
    </div>
  );
}
