import type { Channel } from '@/types/Channel'
import React from 'react'

export default function ChannelInfo(
	{channel, updateSelectedChannel} : 
	{channel : Channel | undefined, updateSelectedChannel : (arg : Channel | undefined) => void}) {

	return (
		<div className="flex items-center justify-center h-[7%]">
			{channel && (<>
				<div className="flex justify-center items-center ml-auto">
					<h1 className="text-3xl">{channel.name}</h1>
				</div>
				<div className="ml-auto mr-[1rem]">
					<button onClick={() => updateSelectedChannel(undefined)}>x</button>
				</div>
			</>)}
		</div>
	)
}
