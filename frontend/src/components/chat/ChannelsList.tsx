import type { Channel } from '@/types/Channel'
import React from 'react'

export default function ChannelsList(
	{channels, updateSelectedChannel, selectedChannel} :
	{channels: Channel[], updateSelectedChannel : (arg : Channel | undefined) => void, selectedChannel : Channel | undefined}) {

	return (
		<div>
			<ul>
				{channels.map((channel : Channel) => (
					<li
						className={`flex justify-center items-center h-[3rem] text-xl m-[5px] rounded-md ${selectedChannel === undefined ? 'bg-[#6466F1]' : (selectedChannel.id === channel.id ? 'bg-[#382FA3]' : 'bg-[#6466F1]')}`}
						onClick={() => {
							updateSelectedChannel(channel)
						}}
						key={channel.id}
					>
						{channel.name}
					</li>
				))}
			</ul>
		</div>
	)
}
