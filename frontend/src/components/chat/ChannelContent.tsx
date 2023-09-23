import type { Channel } from '@/types/Channel'
import type { User } from '@/types/User'
import React from 'react'
import ChannelInfo from './ChannelInfo'
import CreateOrJoin from './CreateOrJoin'

export default function ChannelContent(
	{
		channel,
		updateSelectedChannel,
		user,
		channels,
		updateChannels,
	} :
	{
		channel : Channel | undefined,
		updateSelectedChannel : (arg : Channel | undefined) => void,
		user : User,
		channels : Channel[],
		updateChannels : (arg : Channel[]) => void,
	}) {

	if (channel === undefined) 
		return (
			<CreateOrJoin
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
			<div className="flex flex-col justify-end overflow-auto h-[86%] pb-10px border-b">
				{channel?.messages.map((message) => (
					<div className={`flex my-[5px] mx-[10px] rounded-md ${message.userId === user.id ? 'justify-end' : ''}`} key={message.id}>
						<div className={`p-[6px] rounded-2xl ${message.userId === user.id? 'bg-[#8d8ddab3]':'bg-[#abd9d9b3]'}`}>
							{message.content}
						</div>
					</div>
				))}
			</div>
		</div>
		)
}
