"use client";

import {useUser} from "@/lib/hooks";
import AppHeader from "@/components/App/AppHeader";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import TaskIcon from "@/components/Icons/TaskIcon";
import {Task} from "@/lib/types";
import TaskItem from "@/components/App/Items/TaskItem";
import React, {useEffect, useRef, useState} from "react";
import LoadScreen from "@/components/Login/LoadScreen";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import CreateStandaloneTaskDialog from "@/components/App/Dialogs/Tasks/CreateStandaloneTaskDialog";
import {updateNotificationEvent, useTasksSubscription} from "@/hooks/subscriptionHooks";
import {useTasksQuery} from "@/hooks/queryHooks";

export default function Tasks() {
	const [tasks, setTasks] = useState<Task[]>([]);

	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	const taskItemDialogRef = useRef<DialogModalHandle>(null);

	const { user } = useUser();

	const { data: userTasks } = useTasksSubscription(user);
	const { data: getTasks, loading, refetch: refetchTasks } = useTasksQuery(user);

	async function refetch() {
		if (!user) return;
		await refetchTasks();
	}

	useEffect(() => updateNotificationEvent(
		userTasks?.userTasks.type,
		userTasks?.userTasks.task,
		setTasks
	), [userTasks]);

	useEffect(() => {
		const data = getTasks?.tasks;
		if (!data) return;

		setTasks(data);
	}, [getTasks]);

	useEffect(() => {
		(async () => {
			if (!user) return;
			await refetch();
		})();
	}, []);

	return (
		<>
			<LoadScreen isShown={loading} />
			<div className={"flex flex-col w-full h-fit gap-[36px] py-gutter"}>
				<div className={"flex flex-col gap-[12px]"}>
					<AppHeader
						title={"Tasks"}
						description={`Create tasks to manage the things that need to be done.`}
						icon={<TaskIcon/>}
					/>

					<div className={"flex flex-row px-gutter"}>
						<Button onClick={() => taskItemDialogRef.current?.show()} type={"rounded"} usage={"form"} intent={"primary"}>
							<AddIcon className={"w-[16px] h-[16px]"}/>
							Create task
						</Button>
					</div>
				</div>

				<div className={"flex flex-col h-full gap-[12px]"}>
					<h3 className={"px-gutter"}>
						Tasks
					</h3>

					<div className={"flex flex-col gap-[12px] h-full px-gutter"}>
						{tasks.length > 0
							? tasks.map((t: Task) => (
								<TaskItem
									key={t.id}
									task={t}
									confirmationDialog={confirmationDialogRef}
									className={"w-full h-fit"}
								/>
							)) : (
								<p>
									You haven't created any tasks yet.
								</p>
							)
						}
					</div>
				</div>
			</div>

			<ConfirmationDialog ref={confirmationDialogRef} />

			<CreateStandaloneTaskDialog dialog={taskItemDialogRef}/>
		</>
	);
}