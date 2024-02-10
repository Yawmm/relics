"use client";

import {useUser} from "@/lib/hooks";
import HomeIcon from "@/components/Icons/HomeIcon";
import Subtitle from "@/components/Text/Subtitle";
import AppHeader from "@/components/App/AppHeader";
import {useQuery} from "@apollo/client";
import {GET_PROJECTS_QUERY} from "@/lib/projects";
import {Project, Task} from "@/lib/types";
import ProjectItem from "@/components/App/Projects/ProjectItem";
import Description from "@/components/Text/Description";
import React, {useRef} from "react";
import {useRouter} from "next/navigation";
import {GET_TASKS_QUERY} from "@/lib/tasks";
import TaskItem from "@/components/App/Projects/TaskItem";
import LoadScreen from "@/components/Login/LoadScreen";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";

export default function Home() {
	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);

	const { push } = useRouter();

	const { user } = useUser();
	const { data: projects, loading: projectsLoading, refetch: refetchProjects } = useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY, {
		variables: {
			userId: user?.id
		},
		skip: user === null
	});

	const { data: tasks, loading: tasksLoading, refetch: refetchTasks } = useQuery<{ tasks: Task[] }>(GET_TASKS_QUERY, {
		variables: {
			id: user?.id
		},
		skip: user === null,
	});

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
						{projects?.projects && projects.projects.length > 0
							? projects?.projects?.map((p: Project) => (
								<ProjectItem
									key={p.id}
									project={p}
									className={"min-w-full h-fit"}
									editable={false}

									onClick={async () => push(`/app/projects/${p.id}`)}
									onUpdate={refetchProjects}
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
						{tasks?.tasks && tasks.tasks.length > 0
							? tasks?.tasks?.map((t: Task) => (
								<TaskItem
									key={t.id}
									task={t}
									confirmationDialog={confirmationDialogRef}
									className={"w-full h-fit"}
									editable={false}

									onUpdate={refetchTasks}
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