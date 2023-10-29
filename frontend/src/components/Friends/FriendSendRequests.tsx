// import {
// 	Avatar,
// 	AvatarFallback,
// 	AvatarImage,
// } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card"
// import {
// 	Command,
// 	CommandEmpty,
// 	CommandGroup,
// 	CommandInput,
// 	CommandItem,
// 	CommandList,
// } from "@/components/ui/command"
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from "@/components/ui/popover"

// const FriendSendRequests = ({friends}) => {
// 	return (
// 		<Card className="h-[calc(50%-0.5rem)] m-1">
// 			<CardHeader>
// 				<CardTitle>send requests</CardTitle>
// 			{/* u can add a description here */}
// 			{/* <CardDescription>Invite your team members to collaborate.</CardDescription> */}
// 			</CardHeader>
// 			<CardContent className="grid gap-6 max-h-[calc(100%-72px)] overflow-y-auto">
// 				{friends.map((friend) => (
// 					<div key={friend.name} className="flex items-center justify-between space-x-4">
// 						<div>
// 							<div className="flex items-center space-x-4 ">
// 								<Avatar>
// 									<AvatarImage src="/smazouz.jpeg" />
// 									<AvatarFallback>JL</AvatarFallback>
// 								</Avatar>
// 								<div>
// 									<p className="text-sm font-medium leading-none">{friend.name}</p>
// 									<p className="text-sm text-muted-foreground">{friend.displayName}</p>
// 								</div>
// 							</div>
// 						</div>
// 						<div className="">
// 							<p className="text-md text-muted-foreground">pending....</p>
// 						</div>
// 						<div>
// 							<Button className="bg-red-500 hover:bg-red-600">reject</Button>
// 						</div>
// 					</div>
// 				))}
// 			</CardContent>
// 		</Card>
// 	)
// }
// export default FriendSendRequests