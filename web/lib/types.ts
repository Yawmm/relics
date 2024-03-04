export type NotificationType = "ADDED" | "UPDATED" | "REMOVED";

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

	tags: Tag[]
	tasks: Task[]
	categories: Category[]
}

export type ProjectNotification = {
	type: NotificationType,
	project: Project
}

export type ProjectInviteNotification = {
	type : NotificationType,
	projectInvite: ProjectInvite
}

export type Tag = {
	id: string,
	name: string,
	color: string
}

export type Team = {
	id: string,
	name: string,

	owner: Member,
	members: Member[],
	invites: Invite[]
}

export type TeamNotification = {
	type: NotificationType,
	team: Team
}

export type TeamInviteNotification = {
	type : NotificationType,
	teamInvite: TeamInvite
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

	owner: Member,
	tags: Tag[],
	comments: Comment[]
}

export type TaskNotification = {
	type: NotificationType,
	task: Task
}

export type Comment = {
	id: string,
	content: string,
	timestamp: Date,

	owner: Member
}