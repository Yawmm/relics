"use client"

import {useUser} from "@/lib/hooks";
import {useQuery} from "@apollo/client";
import AppHeader from "@/components/App/AppHeader";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import Subtitle from "@/components/Text/Subtitle";
import {GET_TASKS_QUERY} from "@/lib/tasks";
import TaskIcon from "@/components/Icons/TaskIcon";
import {Project, Task} from "@/lib/types";
import TaskItem from "@/components/App/Projects/TaskItem";
import Description from "@/components/Text/Description";
import React, {useEffect, useRef, useState} from "react";
import LoadScreen from "@/components/Login/LoadScreen";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import CreateTaskDialog from "@/components/App/Dialogs/CreateTaskDialog";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import ChoiceDialog from "@/components/App/Dialogs/ChoiceDialog";
import {GET_PROJECTS_QUERY} from "@/lib/projects";
import Title from "@/components/Text/Title";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";

export default function Tasks() {
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	const chooseProjectDialogRef = useRef<DialogModalHandle>(null);
	const createTaskDialogRef = useRef<DialogModalHandle>(null);
	const taskItemDialogRef = useRef<DialogModalHandle>(null);

	const { user } = useUser();

	const { data: tasks, loading, refetch: refetchTasks } = useQuery(GET_TASKS_QUERY, {
		variables: {
			id: user?.id
		},
		skip: !user,
	});

	const { data: projects, refetch: refetchProjects } = useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY, {
		variables: {
			userId: user?.id
		},
		skip: !user,
	});

	async function refetch() {
		if (!user)
			return;

		await refetchTasks()
		await refetchProjects()
	}

	useEffect(() => {
		(async () => {
			await refetch()
		})()
	}, [user])

	return (
		<>
			<LoadScreen isShown={loading} />
			<div className={"flex flex-col gap-[36px]"}>
				<div className={"flex flex-col gap-[12px]"}>
					<AppHeader
						title={"Tasks"}
						description={`Create tasks to manage the things that need to be done.`}
						icon={<TaskIcon/>}
					/>

					<div className={"flex flex-row px-[var(--gutter-x-margin)]"}>
						<Button onClick={() => taskItemDialogRef.current?.show()} type={"rounded"} usage={"form"} intent={"primary"}>
							<AddIcon className={"w-[16px] h-[16px]"}/>
							Create task
						</Button>
					</div>
				</div>

				<div className={"flex flex-col h-full gap-[12px]"}>
					<Subtitle className={"px-[var(--gutter-x-margin)]"}>
						Tasks
					</Subtitle>

					<div className={"flex flex-col gap-[12px] h-full px-[var(--gutter-x-margin)]"}>
						{tasks?.tasks?.length > 0
							? tasks?.tasks?.map((t: Task) => (
								<TaskItem
									key={t.id}
									task={t}
									confirmationDialog={confirmationDialogRef}
									className={"w-full h-fit"}
									onChange={async () => await refetch()}
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

			<Dialog.Modal ref={taskItemDialogRef}>
				<Dialog.Container>
					<Dialog.Column>
						<Title context={"dialog"}>
							Create task
						</Title>

						<Description>
							Create a new task, with a required project to which the task is linked.
						</Description>
					</Dialog.Column>

					<Dialog.Column>
						<Button
							onClick={() => chooseProjectDialogRef.current?.show()}
							className={"justify-between"}
							type={"square"}
							usage={"form"}
							intent={"primary"}
						>
							{selectedProject?.name ?? "Project"}
							<RightArrowIcon className={"w-[16px] h-[16px]"}/>
						</Button>
						<Button
							focus
							disabled={selectedProject === null}
							onClick={() => createTaskDialogRef.current?.show()}
							className={"justify-between"}
							type={"square"}
							usage={"form"}
							intent={"primary"}
						>
							Task
							<RightArrowIcon className={"w-[16px] h-[16px]"}/>
						</Button>
					</Dialog.Column>

					<Dialog.Row>
						<Button
							onClick={() => taskItemDialogRef.current?.hide()}
							className={"flex flex-grow justify-center"}
							type={"rounded"}
							usage={"form"}
							intent={"secondary"}
						>
							<RemoveIcon className={"w-[16px] h-[16px]"}/>
							Cancel
						</Button>
					</Dialog.Row>
				</Dialog.Container>
			</Dialog.Modal>
		
			<ConfirmationDialog ref={confirmationDialogRef} />

			<ChoiceDialog
				dialog={chooseProjectDialogRef}

				options={projects?.projects?.map(p => ({ id: p.id, name: p.name })) ?? []}

				onSelectOption={id => setSelectedProject(projects?.projects?.find(p => p.id == id) ?? null)}
				onResetOption={() => setSelectedProject(null)}
			/>

			<CreateTaskDialog
				dialog={createTaskDialogRef}

				user={user}
				project={selectedProject}

				onUpdate={async () => await refetch()}
			/>
		</>
	)
}