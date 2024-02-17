import {useSubscription} from "@apollo/client";
import {
	NotificationType,
	Project,
	ProjectInviteNotification,
	ProjectNotification,
	TaskNotification, TeamInviteNotification, TeamNotification,
	User
} from "@/lib/types";
import {PROJECT_SUBSCRIPTION, PROJECTS_SUBSCRIPTION} from "@/lib/projects";
import {TASKS_SUBSCRIPTION} from "@/lib/tasks";
import React from "react";
import {PROJECT_INVITES_SUBSCRIPTION, TEAM_INVITES_SUBSCRIPTION} from "@/lib/users";
import {TEAMS_SUBSCRIPTION} from "@/lib/teams";

export const updateNotificationEvent = <TValue extends { id: string }>(type?: NotificationType, value?: TValue, setter?: React.Dispatch<React.SetStateAction<TValue[]>>) => {
	if (!value || type === undefined || setter == undefined) return;

	switch (type) {
		case "ADDED":
			setter(p => [...p, value]);
			break;
		case "UPDATED":
			setter(p => [...p.filter(t => t.id != value.id), value]);
			break;
		case "REMOVED":
			setter(p => [...p.filter(t => t.id != value.id)]);
			break;
	}
};

export const useTeamsSubscription = (user: User | null) => useSubscription<{ userTeams: TeamNotification }>(TEAMS_SUBSCRIPTION, {
	variables: {
		userId: user?.id
	},
	shouldResubscribe: true,
	skip: !user,
});

export const useTeamInvitesSubscription = (user: User | null) => useSubscription<{ userTeamInvites: TeamInviteNotification }>(TEAM_INVITES_SUBSCRIPTION, {
	variables: {
		userId: user?.id
	},
	shouldResubscribe: true,
	skip: !user,
});

export const useProjectsSubscription = (user: User | null) => useSubscription<{ userProjects: ProjectNotification }>(PROJECTS_SUBSCRIPTION, {
	variables: {
		userId: user?.id
	},
	shouldResubscribe: true,
	skip: !user,
});

export const useProjectSubscription = (project: Project | null) => useSubscription<{ project: ProjectNotification }>(PROJECT_SUBSCRIPTION, {
	variables: {
		id: project?.id
	},
	shouldResubscribe: true,
	skip: !project,
});

export const useProjectInvitesSubscription = (user: User | null) => useSubscription<{ userProjectInvites: ProjectInviteNotification }>(PROJECT_INVITES_SUBSCRIPTION, {
	variables: {
		userId: user?.id
	},
	shouldResubscribe: true,
	skip: !user,
});

export const useTasksSubscription = (user: User | null) => useSubscription<{ userTasks: TaskNotification }>(TASKS_SUBSCRIPTION, {
	variables: {
		id: user?.id
	},
	shouldResubscribe: true,
	skip: !user,
});