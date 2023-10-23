import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import FriendList from "@/components/Friends/FriendList"
import FriendRequests from "@/components/Friends/FrinedRequests"
import FriendSendRequests from "@/components/Friends/FriendSendRequests"

const friends = [
  {

    name: "Sofia Davis",
    displayName: "smazouz@student.ma",
    status: "online",
  },
  {
    name: "Jackson Lee",
    displayName: "smazouz@student.ma",
    status: "offline"

  },
  {
    name: "James Smith",
    displayName: "smazouz@student.ma",
    status: "in game"
  },
  {
    name: "Maria Garcia",
    displayName: "smazouz@student.ma",
    status: "online"

  },
  {
    name: "John Williams",
    displayName: "smazouz@student.ma",
    status: "online"
  },
  {
    name: "Robert Brown",
    displayName: "smazouz@student.ma",
    status: "in game"
  },
  {
    name: "David Jones",
    displayName: "smazouz@student.ma",
    status: "online"
  },
  {
    name: "William Miller",
    displayName: "smazouz@student.ma",
    status: "offline"
  },
  {
    name: "Richard Davis",
    displayName: "smazouz@student.ma",
    status: "offline"
  },
  {

    name: "Sofia Davis",
    displayName: "smazouz@student.ma",
    status: "online",
  },
  {
    name: "Jackson Lee",
    displayName: "smazouz@student.ma",
    status: "offline"

  },
  {
    name: "James Smith",
    displayName: "smazouz@student.ma",
    status: "in game"
  },
  {
    name: "Maria Garcia",
    displayName: "smazouz@student.ma",
    status: "online"

  },
  {
    name: "John Williams",
    displayName: "smazouz@student.ma",
    status: "online"
  },
  {
    name: "Robert Brown",
    displayName: "smazouz@student.ma",
    status: "in game"
  },
  {
    name: "David Jones",
    displayName: "smazouz@student.ma",
    status: "online"
  },
  {
    name: "William Miller",
    displayName: "smazouz@student.ma",
    status: "offline"
  },
  {
    name: "Richard Davis",
    displayName: "smazouz@student.ma",
    status: "offline"
  },
  {
    name: "Richard Davis",
    displayName: "smazouz@student.ma",
    status: "offline"
  },
  {
    name: "Richard Davis",
    displayName: "smazouz@student.ma",
    status: "offline"
  },
  {
    name: "Richard Davis",
    displayName: "smazouz@student.ma",
    status: "offline"
  },
]



const Friends = () => {
  return (
    <div className="h-screen  border flex justify-center gap-10 bg-white py-[5vh] ">
      <FriendList friends={friends}/>
      <div className="flex flex-col h-screen gap-10"  >
        <FriendRequests friends={friends}/>
        <FriendSendRequests friends={friends}/>
      </div>
    </div>
  );
};

export default Friends;