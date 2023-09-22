import React, { useState } from 'react'
import type { User } from '@/types/User'
import type { Channel } from '@/types/Channel'
import ChannelsList from './ChannelsList'
import ChannelContent from './ChannelContent'
import { ScrollArea } from '../ui/scroll-area'

export default function Chat( {user} : {user : User} ) {
	console.log(user)
	const [channels, setChannels] = useState<Channel[]>(user.channels)
	const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>(undefined)

	const updateChannels = (channels : Channel[]) => {
		setChannels(channels)
	}

	const updateSelectedChannel = (channel : Channel | undefined) => {
		setSelectedChannel(channel)
	}


	return (
		//Chat Box
		<div className="flex w-[55rem] h-[50rem] rounded-[6px] bg-[#33437D] text-white">
			<div className="flex flex-col w-[25%] h-[full]">
				<div className="flex pl-[2rem] items-center text-2xl h-[7%] ">Chat room</div>
				{/* Seperator */}
				<div className="border ml-1 rounded-l-full"></div>
				<ScrollArea className="h-[93%]">
						<ChannelsList
							channels={channels}
							updateSelectedChannel={updateSelectedChannel}
							selectedChannel={selectedChannel}
						/>
				</ScrollArea>
			</div>
			{/* Seperator */}
			<div className="border rounded-full my-1"></div>
			<ChannelContent channel={selectedChannel} updateSelectedChannel={updateSelectedChannel} user={user}/>
		</div>
		
	)
}
