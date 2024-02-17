"use client";

import {useUser} from "@/lib/hooks";
import HomeIcon from "@/components/Icons/HomeIcon";
import Subtitle from "@/components/Text/Subtitle";
import AppHeader from "@/components/App/AppHeader";
import {Project, Task} from "@/lib/types";
import ProjectItem from "@/components/App/Projects/ProjectItem";
import Description from "@/components/Text/Description";
import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import TaskItem from "@/components/App/Projects/TaskItem";
import LoadScreen from "@/components/Login/LoadScreen";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {updateNotificationEvent, useProjectsSubscription, useTasksSubscription} from "@/hooks/subscriptionHooks";
import {useProjectsQuery, useTasksQuery} from "@/hooks/queryHooks";

export default function Home() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);

	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);

	const { push } = useRouter();
	const { user } = useUser();

	const { data: userProjects } = useProjectsSubscription(user);
	const { data: userTasks } = useTasksSubscription(user);

	const { data: getProjects, loading: projectsLoading } = useProjectsQuery(user);
	const { data: getTasks, loading: tasksLoading } = useTasksQuery(user);

	useEffect(() => updateNotificationEvent(
		userProjects?.userProjects.type,
		userProjects?.userProjects.project,
		setProjects
	), [userProjects]);

	useEffect(() => updateNotificationEvent(
		userTasks?.userTasks.type,
		userTasks?.userTasks.task,
		setTasks
	), [userTasks]);

	useEffect(() => {
		const data = getProjects?.projects;
		if (!data) return;

		setProjects(data);
	}, [getProjects]);

	useEffect(() => {
		const data = getTasks?.tasks;
		if (!data) return;

		setTasks(data);
	}, [getTasks]);

	return (
		<>
			<LoadScreen isShown={projectsLoading || tasksLoading} />
			<div className={"flex flex-col w-full h-full gap-[36px]"}>
				<AppHeader
					title={"Home"}
					description={`Welcome back, ${user?.username}, here's what's next.`}
					icon={<HomeIcon />}
				/>

				<div className={"flex flex-col gap-[12px]"}>
					<Subtitle className={"px-[var(--gutter-x-margin)]"}>
						Recent projects
					</Subtitle>

					<div className={"flex flex-row gap-[12px] w-full overflow-x-auto px-[var(--gutter-x-margin)] py-[8px] my-[-8px]"}>
						{projects.length > 0
							? projects.map((p: Project) => (
								<ProjectItem
									key={p.id}
									project={p}
									className={"min-w-full h-fit"}
									editable={false}

									onClick={async () => push(`/app/projects/${p.id}`)}
								/>
							))
							: (
								<Description>
									You haven't created any projects yet.
								</Description>
							)
						}
					</div>
				</div>

				<div className={"flex flex-col gap-[12px]"}>
					<Subtitle className={"px-[var(--gutter-x-margin)]"}>
						Recent tasks
					</Subtitle>

					<div className={"flex flex-col gap-[12px] w-full overflow-x-auto px-[var(--gutter-x-margin)] py-[8px] my-[-8px]"}>
						{tasks.length > 0
							? tasks.map((t: Task) => (
								<TaskItem
									key={t.id}
									task={t}
									confirmationDialog={confirmationDialogRef}
									className={"w-full h-fit"}
								/>
							)) : (
								<Description>
									You haven't created any tasks yet.
								</Description>
							)
						}
					</div>
				</div>
			</div>

			<ConfirmationDialog ref={confirmationDialogRef} />
		</>
	);
}