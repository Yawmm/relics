import {MemoryMeasurement} from "node:vm";

export type User = {
	id: string,
	username: string,
	email: string
}

export type Member = {
	userId: string,
	username: string,
	email: string
}

export type Invite = {
	userId: string,
	username: string,
	email: string
}

export type ProjectInvite = {
	id: string,
	name: string,
	description: string
}

export type TeamInvite = {
	id: string,
	name: string
}

export type Project = {
	id: string,
	name: string,
	description: string

	owner: Member
	members: Member[]
	links: Link[]
	invites: Invite[]

	tasks: Task[]
	categories: Category[]
}

export type Team = {
	id: string,
	name: string,

	owner: Member,
	members: Member[],
	invites: Invite[]
}

export type Link = {
	id: string,
	name: string,

	owner: Member,
	members: Member[],
}

export type Category = {
	id: string,
	name: string,

	tasks: Task[]
}

export type Task = {
	id: string,
	name: string,
	description: string,
	isFinished: boolean,

	owner: Member
}