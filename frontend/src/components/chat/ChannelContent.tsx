import type { Channel } from '@/types/Channel'
import type { User } from '@/types/User'
import type { Socket } from 'socket.io'
import React, { useState } from 'react'
import ChannelInfo from './ChannelInfo'
import CreateOrJoin from './CreateOrJoin'
import Image from 'next/image'
import { ScrollArea } from '../ui/scroll-area'
import ScrollableFeed from 'react-scrollable-feed'

export default function ChannelContent(
	{
		channel,
		updateSelectedChannel,
		user,
		channels,
		updateChannels,
		// socket
	} :
	{
		channel : Channel | undefined,
		updateSelectedChannel : (arg : Channel | undefined) => void,
		user : User,
		channels : Channel[],
		updateChannels : (arg : Channel[]) => void,
		// socket: unknown
	}) {
	const [messages, setMessages] = useState<string>("");

	const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// setMessages(messages.trim());
		console.log("'"+messages+"'");
		if (messages === "") return;
		channel?.messages.push({
			id: Math.random().toString(36).substring(7),
			userId: user.id,
			content: messages,
			channelId: channel.id
		})
		setMessages("");
		(e.target as HTMLFormElement).reset();
	}


	if (channel === undefined) 
		return (
			<CreateOrJoin
				user={user}
				channels={channels}
				updateChannels={updateChannels}
				updateSelectedChannel={updateSelectedChannel}
			/>
		)

	return (
		<div className="flex flex-col w-[75%] h-[100%]">
			<ChannelInfo channel={channel} updateSelectedChannel={updateSelectedChannel}/>
			{/* seperator */}
			<div className="border rounded-r-full mr-1"></div>
			{/* channel messages container*/}
			<div className="flex flex-col justify-end h-[86%] pb-10px">
				<ScrollableFeed className="grow">
					{channel?.messages.map((message) => (
						<div className={`chat ml-[0.75rem] justify-self-end rounded-md ${message.userId === user.id ? 'chat-end' : 'chat-start'}`} key={message.id}>
							<div className={`py-[6px] px-[1rem] rounded-2xl max-w-[36rem] ${message.userId === user.id? 'bg-[#8d8ddab3]':'bg-[#abd9d9b3]'}`}>
								{message.content}
							</div>
						</div>
					))}
				</ScrollableFeed>
			</div>
			<form
				className="flex h-[2rem] border mt-[1rem] mx-[1rem] rounded-full bg-[#d9d9d933]"
				onSubmit={(e) => sendMessage(e)}
			>
					<input
						type="text"
						placeholder="type your message here..."
						className="pb-[5px] rounded-l-full w-[90%] h-[2rem] bg-[#00000000] px-3 focus:outline-none"
						onChange={(e) => setMessages(e.target.value.trim())}
					/>
					<button className="flex items-center justify-center rounded-full w-[10%] bg-[#382FA3]">
						<Image className="" src={"/send_button.png"} alt="image" width={21} height={16}/>
					</button>
			</form>
		</div>
		)
}