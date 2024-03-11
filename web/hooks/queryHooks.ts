import {useQuery} from "@apollo/client";
import {Project, ProjectInvite, Task, Team, TeamInvite, User} from "@/lib/types";
import {GET_PROJECT_FILTER_QUERY, GET_PROJECT_QUERY, GET_PROJECTS_QUERY} from "@/lib/projects";
import {GET_TASKS_QUERY} from "@/lib/tasks";
import {GET_PROJECT_INVITES_QUERY, GET_TEAM_INVITES_QUERY, GET_USER_QUERY} from "@/lib/users";
import {GET_TEAMS_QUERY} from "@/lib/teams";
import {ProjectFilter} from "@/components/App/Dialogs/Projects/FilterProjectDialog";

export const useUserQuery = (id: string) => useQuery<{ user: User }>(GET_USER_QUERY, {
	variables: {
		id: id
	},
	skip: !id,
	fetchPolicy: "no-cache"
});

export const useTeamsQuery = (user: User | null) => useQuery<{ teams: Team[] }>(GET_TEAMS_QUERY, {
	variables: {
		id: user?.id
	},
	skip: user === null,
	fetchPolicy: "no-cache"
});

export const useTeamInvitesQuery = (user: User | null) => useQuery<{ teamInvites: TeamInvite[] }>(GET_TEAM_INVITES_QUERY, {
	variables: {
		id: user?.id
	},
	skip: user === null,
	fetchPolicy: "no-cache"
});

export const useProjectsQuery = (user : User | null, filter?: ProjectFilter) => useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY, {
	variables: {
		userId: user?.id,
		tags: filter?.tags.map(t => t.id)
	},
	skip: user === null,
	fetchPolicy: "no-cache"
});

export const useProjectQuery = (id: string, filter?: ProjectFilter) => useQuery<{ project: Project }>(filter ? GET_PROJECT_FILTER_QUERY : GET_PROJECT_QUERY, {
	variables: {
		id: id,
		tags: filter?.tags.map(t => t.id)
	},
	skip: id === null,
	fetchPolicy: "no-cache"
});

export const useProjectInvitesQuery = (user : User | null) => useQuery<{ projectInvites: ProjectInvite[] }>(GET_PROJECT_INVITES_QUERY, {
	variables: {
		id: user?.id
	},
	skip: user === null,
	fetchPolicy: "no-cache"
});

export const useTasksQuery = (user : User | null) => useQuery<{ tasks: Task[] }>(GET_TASKS_QUERY, {
	variables: {
		id: user?.id
	},
	skip: user === null,
	fetchPolicy: "no-cache"
});