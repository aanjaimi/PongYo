export enum ChatType {
	PUBLIC= 'public',
	PRIVATE= 'private',
	PROTECTED= 'protected',
}

export enum Buttons {
PROFILE = "Profile",
GAME = "Game",
FRIENDS = "Friends",
CHAT = "Chat",
PARAM = "Param",
}

export enum ALLbuttons {
PROFILE_ON = "/user_on.png",
PROFILE_OFF = "/user_off.png",
GAME_OFF = "/game_off.png",
GAME_ON = "/game_on.png",
FRIENDS_OFF = "/fre_off.png",
FRIENDS_ON = "/fre_on.png",
CHAT_OFF = "/mes_off.png",
CHAT_ON = "/mes_on.png",
PARAM_OFF = "/param_off.png",
PARAM_ON = "/param_on.png",
}

export type User = {
	id:            string
	firstName:     string
	lastName:      string
	userName:      string
	email:         string
	cover:         string
	avatar:        string
	towFactorAuth: boolean
	channels:      Channel[]
};

export type Message = {
	id: string
	content: string
	channelId: string
	userId: string
	createdAt: Date
}

export type Channel = {
	id: string
	name: string
	type: ChatType
	moderatorId: string
	createdAt: Date
	messages: Message[]
	members: User[]
	memberCount: number
	memberLimit: number
}