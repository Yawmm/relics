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

export type Project = {
	id: string,
	name: string,
	description: string

	owner: Member
	members: Member[]
	invites: Invite[]

	tasks: Task[]
	categories: Category[]
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