"use client";

import {useUser} from "@/lib/hooks";
import {useQuery} from "@apollo/client";
import AppHeader from "@/components/App/AppHeader";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import Subtitle from "@/components/Text/Subtitle";
import {GET_TASKS_QUERY} from "@/lib/tasks";
import TaskIcon from "@/components/Icons/TaskIcon";
import {Task} from "@/lib/types";
import TaskItem from "@/components/App/Projects/TaskItem";
import Description from "@/components/Text/Description";
import React, {useEffect, useRef} from "react";
import LoadScreen from "@/components/Login/LoadScreen";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import CreateStandaloneTaskDialog from "@/components/App/Dialogs/Tasks/CreateStandaloneTaskDialog";

export default function Tasks() {
	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	const taskItemDialogRef = useRef<DialogModalHandle>(null);

	const { user } = useUser();

	const { data: tasks, loading, refetch: refetchTasks } = useQuery<{ tasks: Task[] }>(GET_TASKS_QUERY, {
		variables: {
			id: user?.id
		},
		skip: !user,
	});

	async function refetch() {
		if (!user) return;
		await refetchTasks();
	}

	useEffect(() => {
		(async () => {
			if (!user) return;
			await refetch();
		})();
	}, [user]);

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
						{tasks?.tasks && tasks.tasks.length > 0
							? tasks?.tasks?.map((t: Task) => (
								<TaskItem
									key={t.id}
									task={t}
									confirmationDialog={confirmationDialogRef}
									className={"w-full h-fit"}

									onUpdate={refetch}
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

			<CreateStandaloneTaskDialog
				dialog={taskItemDialogRef}

				onUpdate={refetch}
			/>
		</>
	);
}