import type { Channel } from '@/types/Channel'
import type { User } from '@/types/User'
import React from 'react'
import ChannelInfo from './ChannelInfo'

export default function ChannelContent(
	{channel, updateSelectedChannel, user} :
	{channel : Channel | undefined, updateSelectedChannel : (arg : Channel | undefined) => void, user : User}) {

	// if (channel === undefined)
	// 	return ()

	return (
		<div className="flex flex-col w-[75%] h-[100%]">
			<ChannelInfo channel={channel} updateSelectedChannel={updateSelectedChannel}/>
			<div className="flex flex-col justify-end overflow-auto h-[86%] pb-10px border-b">
				{channel?.messages.map((message) => (
					<div className={`flex my-[5px] mx-[10px] rounded-md ${message.userId === user.id ? 'justify-end' : ''}`} key={message.id}>
						<div className={`p-2 rounded-2xl ${message.userId === user.id? 'bg-[#8d8ddab3]':'bg-[#abd9d9b3]'}`}>
							{message.content.content}
						</div>
					</div>
				))}
			</div>
		</div>
		)
}
