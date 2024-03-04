import {Category, Project, Task} from "@/lib/types";
import TaskIcon from "@/components/Icons/TaskIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import EditIcon from "@/components/Icons/EditIcon";
import React, {RefObject, useCallback, useRef} from "react";
import {editTask, removeTask} from "@/lib/tasks";
import Sheet, {SheetModalHandle} from "@/components/Input/Modals/Sheet";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import EditTaskDialog from "@/components/App/Dialogs/Tasks/EditTaskDialog";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {useUser} from "@/lib/hooks";
import CommentIcon from "@/components/Icons/CommentIcon";
import CommentDialog from "@/components/App/Dialogs/Tasks/CommentDialog";
import CommentItem from "@/components/App/Projects/CommentItem";
import TagItem from "@/components/App/Projects/TagItem";
import TagIcon from "@/components/Icons/TagIcon";
import TagDialog from "@/components/App/Dialogs/Projects/Tags/TagDialog";

type TaskItemProps = {
	task: Task,
	confirmationDialog: RefObject<ConfirmationDialogHandle>,

	category?: Category | undefined,
	project?: Project | undefined,
	className?: string,
}

export default function TaskItem({ task, category, project, confirmationDialog, className } : TaskItemProps) {
	const sheetRef = useRef<SheetModalHandle>(null);
	const editTaskDialog = useRef<DialogModalHandle>(null);

	const commentDialog = useRef<DialogModalHandle>(null);
	const tagDialog = useRef<DialogModalHandle>(null);

	const { user } = useUser();
	
	const isOwner = useCallback(() => task.owner.userId == user?.id, [task, user]);

	async function finishTask() {
		await editTask(
			task.id,
			{
				isFinished: !task.isFinished,
				categoryId: category?.id
			}
		);
	}
	
	function deleteTask() {
		confirmationDialog.current?.show(
			"Remove task",
			"Are you sure you want to remove the given task indefinitely?",
			async () => await removeTask(task.id)
		);
	}

	return (
		<>
			<div className={`flex flex-row items-center text-left gap-[12px] ${task.isFinished ? "bg-zinc-50" : "bg-zinc-700"} rounded-xl ${className}`}>
				<button onClick={() => sheetRef.current?.toggle()} className={"card flex flex-row flex-grow items-center gap-[12px] text-left rounded-xl focus:outline-none focus:ring-4 focus:ring-zinc-500"}>
					<div>
						<TaskIcon className={`icon ${task.isFinished ? "text-zinc-700" : "text-zinc-200"}`}/>
					</div>
					<div className={`flex flex-col flex-grow text-left`}>
						<h4 className={task.isFinished ? "text-zinc-700" : "text-zinc-200"}>
							{task.name}
						</h4>
						<p className={task.isFinished ? "text-zinc-700" : "text-zinc-400"}>
							{task.description}
						</p>
					</div>
				</button>
			</div>

			<EditTaskDialog
				dialog={editTaskDialog}
				task={task}
				category={category}
				project={project}
			/>
		
			<Sheet.Modal ref={sheetRef}>
				<Sheet.Container>
					<Sheet.Column>
						<h1>
							{task.name}
						</h1>

						<div className={"flex flex-col gap-[24px]"}>
							<p>
								{task.description}
							</p>

							<Sheet.Column>
								<h4>
									Tags
								</h4>
								<div className={"flex flex-row gap-[12px] overflow-x-auto"}>
									{task.tags?.length > 0 ? (
										task.tags?.map(t => <TagItem tag={t} task={task} confirmationDialog={confirmationDialog}/>)
									) : (
										<p>
											No tags have been added to the task yet.
										</p>
									)}
								</div>
							</Sheet.Column>
							<Sheet.Column>
								<h4>
									Comments
								</h4>
								<div className={"flex flex-col gap-[12px]"}>
									{task.comments?.length > 0 ? (
										task.comments?.map(c => <CommentItem comment={c} confirmationDialog={confirmationDialog}/>)
									) : (
										<p>
											No comments have been added to the task yet.
										</p>
									)}
								</div>
							</Sheet.Column>
						</div>
					</Sheet.Column>

					<Sheet.Row>
						{isOwner() && (
							<Button focus onClick={() => deleteTask()} type={"circle"} usage={"form"}
									intent={"secondary"}>
								<DeleteIcon className={"small-icon text-zinc-200"}/>
							</Button>
						)}
						{project && (
							<>
								<Button onClick={() => editTaskDialog.current?.show()} type={"circle"} usage={"form"}
										intent={"secondary"}>
									<EditIcon className={"small-icon text-zinc-200"}/>
								</Button>
								<Button onClick={() => tagDialog.current?.show()} type={"circle"} usage={"form"}
										intent={"secondary"}>
									<TagIcon className={"small-icon text-zinc-200"}/>
								</Button>
							</>
						)}
						<Button focus onClick={() => commentDialog.current?.show()} type={"circle"} usage={"form"}
								intent={"secondary"}>
							<CommentIcon className={"small-icon"}/>
						</Button>
						<Button onClick={async () => await finishTask()} type={"circle"} usage={"form"}
								intent={task.isFinished ? "primary" : "secondary"}>
							<ConfirmIcon className={"small-icon"}/>
						</Button>
						<div className={"hidden md:flex md:flex-grow"}>
							<Button onClick={() => sheetRef.current?.hide()} type={"rounded"} usage={"form"}
									intent={"primary"} className={"flex-grow justify-center"}>
								<RemoveIcon className={"small-icon"}/>
								Close
							</Button>
						</div>
						<div className={"flex flex-grow md:hidden"}>
							<Button onClick={() => sheetRef.current?.hide()} type={"rounded"} usage={"form"} intent={"primary"} className={"flex flex-grow justify-center"}>
								<RemoveIcon className={"small-icon"}/>
							</Button>
						</div>
					</Sheet.Row>
				</Sheet.Container>
			</Sheet.Modal>

			<CommentDialog dialog={commentDialog} user={user} task={task}/>
			<TagDialog dialog={tagDialog} project={project} task={task}/>
		</>
	);
}