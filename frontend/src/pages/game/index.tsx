
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



const FriendList = () => {
  return (
    <div className="h-screen  border flex justify-center gap-10 bg-white py-[5vh] ">
      <Card className="h-[90vh]">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Invite your team members to collaborate.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 max-h-[calc(90vh-9vh)] overflow-y-auto">
          {friends.map((friend) => (
            <div key={friend.name} className="flex items-center justify-between space-x-4">
              <div>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/smazouz.jpeg" />
                    <AvatarFallback>JL</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">{friend.displayName}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <p
                  className={`animate-pulse flex items-center rounded-full mx-1 w-3 h-3 ${friend.status === 'online'
                      ? 'bg-green-500'
                      : friend.status === 'offline'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                />
                <p className="text-sm text-muted-foreground">{friend.status}</p>
              </div>
              <div>
                <Button className="bg-red-500 hover:bg-red-600">unfriend</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col h-screen gap-10"  >
        <Card className="">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Invite your team members to collaborate.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 max-h-[calc(90vh-55vh)] overflow-y-auto">

            {friends.map((friend) => (
              <div key={friend.name} className="flex items-center justify-between space-x-4">
                <div>
                  <div className="flex items-center space-x-4 ">
                    <Avatar>
                      <AvatarImage src="/smazouz.jpeg" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{friend.name}</p>
                      <p className="text-sm text-muted-foreground">{friend.displayName}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Button className="bg-green-500 hover:bg-green-600">accept</Button>
                </div>
                <div>
                  <Button className="bg-red-500 hover:bg-red-600">reject</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Invite your team members to collaborate.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 max-h-[calc(90vh-55vh)] overflow-y-auto">
            {friends.map((friend) => (
              <div key={friend.name} className="flex items-center justify-between space-x-4">
                <div>
                  <div className="flex items-center space-x-4 ">
                    <Avatar>
                      <AvatarImage src="/smazouz.jpeg" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{friend.name}</p>
                      <p className="text-sm text-muted-foreground">{friend.displayName}</p>
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="text-md text-muted-foreground">pending....</p>
                </div>
                <div>
                  <Button className="bg-red-500 hover:bg-red-600">reject</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FriendList;




