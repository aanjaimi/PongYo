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
		<div className="flex w-[60rem] h-[60rem] rounded-[25px] bg-[#33437D] text-white">
			<div className="flex flex-col w-[25%] h-[full] border-r">
				<div className="flex pl-[2rem] items-center text-2xl w-[15rem] h-[7%] border-b">Chat room</div>
				<ScrollArea className="h-[93%]">
						<ChannelsList
							channels={channels}
							updateSelectedChannel={updateSelectedChannel}
							selectedChannel={selectedChannel}
						/>
				</ScrollArea>
			</div>
			<ChannelContent channel={selectedChannel} updateSelectedChannel={updateSelectedChannel} user={user}/>
		</div>
		
	)
}
