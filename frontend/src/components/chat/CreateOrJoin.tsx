import React, {useState} from 'react'
import type { Channel } from '@/types/Channel'
import JoinChannel from './JoinChannel'
import type { User } from '@/types/User';

// todo check the unfinished parts of this component

export default function CreateOrJoin(
	{
		channels,
		updateChannels,
		updateSelectedChannel,
	} : 
	{
		channels : Channel[],
		updateChannels : (arg : Channel[]) => void,
		updateSelectedChannel : (arg : Channel | undefined) => void,
	}) {
	const [userName, setUserName] = useState<string>("");
	const [joinChannelName, setJoinChannelName] = useState<string>("");
	const [joinChannelPassword, setJoinChannelPassword] = useState<string>("");
	const [channelName, setChannelName] = useState<string>("");
	const [channelPassword, setChannelPassword] = useState<string>("");


	return (
		<div className="flex flex-col grow">
			<div className="h-[7%]"></div>
			{/* Seperator */}
			<div className="border mr-1 rounded-l-full"></div>
			<div className="flex flex-col grow items-center">
				<div className="text-[40px] my-[2rem]">Join or create a channel room</div>
				{/* join channel */}
				<JoinChannel
					userName={userName}
					setUserName={setUserName}
					joinChannelName={joinChannelName}
					setJoinChannelName={setJoinChannelName}
					joinChannelPassword={joinChannelPassword}
					setJoinChannelPassword={setJoinChannelPassword}
				/>
				{/* Or Seperator */}
				<div className="w-full my-[4rem] flex items-center">
					<div className="ml-[1rem] w-[45%] h-[0] rounded-full border"></div>
					<div className="flex items-center justify-center text-3xl w-[10%]">or</div>
					<div className="mr-[1rem] w-[45%] h-[0] rounded-full border"></div>
				</div>
				{/* create channel */}
				{/* todo finish the create channel component */}
				<div className="flex self-end mr-[35%] mb-[2rem]">
					<div className="text-xl">Create a channel:</div>
					<div className="flex w-[13rem] ml-6 rounded-full bg-white">
							<input
								type="text"
								placeholder='username...'
								className="text-black px-4 rounded-full w-full focus:outline-none"
							/>
						</div>
				</div>
				<div className="flex flex-col border">
				</div>
			</div>
		</div>
	)
}
