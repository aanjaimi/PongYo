import type { User } from '@/types/User'
import type { Channel } from '@/types/Channel'
import React, { useState } from 'react'
import ChannelsList from './ChannelsList'
import ChannelContent from './ChannelContent'
import { ScrollArea } from '../ui/scroll-area'
import { io, Socket } from 'socket.io-client'

export default function Chat( {user} : {user : User} ) {
	const [channels, setChannels] = useState<Channel[]>(user.channels)
	const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>(undefined)

	// const socket = io('http://localhost:3000')

	const updateChannels = (channels : Channel[]) => {
		setChannels(channels)
	}

	const updateSelectedChannel = (channel : Channel | undefined) => {
		setSelectedChannel(channel)
	}

	return (
		//Chat Box
		<div className="flex w-[60rem] h-[50rem] rounded-[6px] bg-[#33437D] text-white">
			<div className="flex flex-col w-[25%] h-[full]">
				<div className="flex pl-[2rem] items-center text-2xl h-[7%] ">chat room</div>
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
			<ChannelContent
				channel={selectedChannel}
				updateSelectedChannel={updateSelectedChannel}
				user={user}
				channels={channels}
				updateChannels={updateChannels}
				// socket={socket}
			/>
		</div>
		
	)
}
