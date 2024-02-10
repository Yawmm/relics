import {Task} from "@/lib/types";
import TaskIcon from "@/components/Icons/TaskIcon";
import Header from "@/components/Text/Header";
import Description from "@/components/Text/Description";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import EditIcon from "@/components/Icons/EditIcon";
import React, {RefObject, useCallback, useRef} from "react";
import {editTask, removeTask} from "@/lib/tasks";
import Sheet, {SheetModalHandle} from "@/components/Input/Modals/Sheet";
import Title from "@/components/Text/Title";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import EditTaskDialog from "@/components/App/Dialogs/Tasks/EditTaskDialog";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {useUser} from "@/lib/hooks";

type TaskItemProps = {
	task: Task,
	confirmationDialog: RefObject<ConfirmationDialogHandle>,

	className?: string,
	onUpdate?: () => void
}

export default function TaskItem({ task, confirmationDialog, className, onUpdate } : TaskItemProps) {
	const sheetRef = useRef<SheetModalHandle>(null);
	const editTaskDialog = useRef<DialogModalHandle>(null);
	
	const { user } = useUser();
	
	const isOwner = useCallback(() => task.owner.userId == user?.id, [task, user]);

	async function finishTask() {
		await editTask(
			task.id,
			{
				isFinished: !task.isFinished 
			}
		);
		
		if (onUpdate) onUpdate();
	}
	
	function deleteTask() {
		confirmationDialog.current?.show(
			"Remove task",
			"Are you sure you want to remove the given task indefinitely?",
			async () => {
				await removeTask(task.id);
				if (onUpdate) onUpdate();
			}
		);
	}

	return (
		<>
			<div className={`flex flex-row items-center text-left gap-[12px] ${task.isFinished ? "bg-zinc-50" : "bg-zinc-700"} rounded-xl ${className}`}>
				<button onClick={() => sheetRef.current?.toggle()} className={"flex flex-row flex-grow items-center p-[16px] gap-[12px] text-left rounded-xl focus:outline-none focus:ring-4 focus:ring-zinc-500"}>
					<div>
						<TaskIcon className={`w-[24px] h-[24px] ${task.isFinished ? "text-zinc-700" : "text-zinc-200"}`}/>
					</div>
					<div className={`flex flex-col flex-grow text-left`}>
						<Header className={task.isFinished ? "text-zinc-700" : "text-zinc-200"}>
							{task.name}
						</Header>
						<Description className={task.isFinished ? "text-zinc-700" : "text-zinc-400"}>
							{task.description}
						</Description>
					</div>
				</button>
			</div>

			<EditTaskDialog
				dialog={editTaskDialog}
				task={task}
				
				onUpdate={async () => onUpdate && await onUpdate()}
			/>
		
			<Sheet.Modal ref={sheetRef}>
				<Sheet.Container>
					<Sheet.Column>
						<Title>
							{task.name}
						</Title>

						<Description>
							{task.description}
						</Description>
					</Sheet.Column>

					<Sheet.Row>
						{isOwner() && (
							<Button focus onClick={() => deleteTask()} type={"circle"} usage={"form"} intent={"secondary"}>
								<DeleteIcon className={"w-[16px] h-[16px] text-zinc-200"}/>
							</Button>
						)}
						<Button onClick={() => editTaskDialog.current?.show()} type={"circle"} usage={"form"} intent={"secondary"}>
							<EditIcon className={"w-[16px] h-[16px] text-zinc-200"}/>
						</Button>
						<Button onClick={async () => await finishTask()} type={"circle"} usage={"form"} intent={task.isFinished ? "primary" : "secondary"}>
							<ConfirmIcon className={"w-[16px] h-[16px]"}/>
						</Button>
						<Button onClick={() => sheetRef.current?.hide()} type={"rounded"} usage={"form"} intent={"primary"} className={"flex-grow justify-center"}>
							<RemoveIcon className={"w-[16px] h-[16px]"}/>
							Close
						</Button>
					</Sheet.Row>
				</Sheet.Container>
			</Sheet.Modal>
		</>
	);
}