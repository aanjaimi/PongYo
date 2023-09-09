import type { Channel } from '@/types/Channel'
import React from 'react'

export default function ChannelsList(
		{channels, updateSelectedChannel} :
		{channels: Channel[], updateSelectedChannel : (arg : Channel | null) => void}) {

	return (
		<div>
			<ul>
				{channels.map((channel : Channel) => (
					<li className="flex justify-center items-center border h-[3rem] text-xl"
						onClick={() => updateSelectedChannel(channel)}
						key={channel.id}
					>
						<button >
							{channel.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}
