// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import FriendList from "@/components/Friends/FriendList"
// import FriendRequests from "@/components/Friends/FrinedRequests"
// import FriendSendRequests from "@/components/Friends/FriendSendRequests"
// import router from "next/router"

// const friends = [
//   {

//     name: "Sofia Davis",
//     displayName: "smazouz@student.ma",
//     status: "online",
//   },
//   {
//     name: "Jackson Lee",
//     displayName: "smazouz@student.ma",
//     status: "offline"

//   },
//   {
//     name: "James Smith",
//     displayName: "smazouz@student.ma",
//     status: "in game"
//   },
//   {
//     name: "Maria Garcia",
//     displayName: "smazouz@student.ma",
//     status: "online"

//   },
//   {
//     name: "John Williams",
//     displayName: "smazouz@student.ma",
//     status: "online"
//   },
//   {
//     name: "Robert Brown",
//     displayName: "smazouz@student.ma",
//     status: "in game"
//   },
//   {
//     name: "David Jones",
//     displayName: "smazouz@student.ma",
//     status: "online"
//   },
//   {
//     name: "William Miller",
//     displayName: "smazouz@student.ma",
//     status: "offline"
//   },
//   {
//     name: "Richard Davis",
//     displayName: "smazouz@student.ma",
//     status: "offline"
//   },
//   {

//     name: "Sofia Davis",
//     displayName: "smazouz@student.ma",
//     status: "online",
//   },
//   {
//     name: "Jackson Lee",
//     displayName: "smazouz@student.ma",
//     status: "offline"

//   },
//   {
//     name: "James Smith",
//     displayName: "smazouz@student.ma",
//     status: "in game"
//   },
//   {
//     name: "Maria Garcia",
//     displayName: "smazouz@student.ma",
//     status: "online"

//   },
//   {
//     name: "John Williams",
//     displayName: "smazouz@student.ma",
//     status: "online"
//   },
//   {
//     name: "Robert Brown",
//     displayName: "smazouz@student.ma",
//     status: "in game"
//   },
//   {
//     name: "David Jones",
//     displayName: "smazouz@student.ma",
//     status: "online"
//   },
//   {
//     name: "William Miller",
//     displayName: "smazouz@student.ma",
//     status: "offline"
//   },
//   {
//     name: "Richard Davis",
//     displayName: "smazouz@student.ma",
//     status: "offline"
//   },
//   {
//     name: "Richard Davis",
//     displayName: "smazouz@student.ma",
//     status: "offline"
//   },
//   {
//     name: "Richard Davis",
//     displayName: "smazouz@student.ma",
//     status: "offline"
//   },
//   {
//     name: "Richard Davis",
//     displayName: "smazouz@student.ma",
//     status: "offline"
//   },
// ]



// const Friends = () => {
//   return (
//     <div className=" h-[calc(100vh-64px)] flex justify-center  items-center w-screen  bg-white space-x-10">
//       <div className="flex flex-col h-full"  >
//         <FriendRequests friends={friends}/>
//         <FriendSendRequests friends={friends}/>
//       </div>
//       <FriendList friends={friends}/>
//     </div>
//   );
// };
// export default Friends;

// const home = () => {
//   return (
//     <div className="w-scren h-screen flex justify-center items-center">
//       <h1>Test</h1>
//       <Button
//         onClick={() => {
//           router.push({
//             pathname: '/game',
//             query: {
//               username: 'aanjaimi',
//             },
//           }).catch(err => console.log(err))
//         }
//         }
//       > click me
//       </Button>
//     </div >
//   )
// }

// export default home;
const home = () => {
  return (
    <div className="w-scren h-screen flex justify-center items-center">
      <h1>Test</h1>
  
    </div >
  )
}
export default home;