import type { Channel } from '@/types/Channel'
import React from 'react'

export default function ChannelContent({channel} : {channel : Channel | null}) {

	return (
		<div className="flex flex-col-reverse overflow-auto h-[52rem] border">
			{channel?.messages.map((message) => (
				<div className="border-b" key={message.id}>
					<p>{message.content}</p>
				</div>
			))}
		</div>
	)
}
