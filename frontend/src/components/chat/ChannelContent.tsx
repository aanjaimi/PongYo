import type { Channel } from '@/types/Channel'
import type { User } from '@/types/User'
import React from 'react'
import ChannelInfo from './ChannelInfo'

export default function ChannelContent(
	{channel, updateSelectedChannel, user} :
	{channel : Channel | undefined, updateSelectedChannel : (arg : Channel | undefined) => void, user : User}) {

	return (
		<div className="flex flex-col w-[75%] h-[100%]">
			<ChannelInfo channel={channel} updateSelectedChannel={updateSelectedChannel}/>
			{/* seperator */}
			<div className="border rounded-r-full mr-1"></div>
			{/* channel messages container*/}
			{
				channel !== undefined &&
				<div className="flex flex-col justify-end overflow-auto h-[86%] pb-10px border-b">
					{channel?.messages.map((message) => (
						<div className={`flex my-[5px] mx-[10px] rounded-md ${message.userId === user.id ? 'justify-end' : ''}`} key={message.id}>
							<div className={`p-[6px] rounded-2xl ${message.userId === user.id? 'bg-[#8d8ddab3]':'bg-[#abd9d9b3]'}`}>
								{message.content}
							</div>
						</div>
					))}
				</div>
			}
			{
				channel === undefined &&
				<div className="flex flex-col border grow items-center justify-evenly">
					<div className="text-3xl">Join or create a channel room</div>
					{/* Direct message container */}
					<div className="text-md">Direct message:</div>
				</div>
			}
		</div>
		)
}
