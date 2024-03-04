import React, {FormEvent, RefObject, useState} from "react";
import {Project, Tag, Task} from "@/lib/types";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import {editTag} from "@/lib/tags";
import AddIcon from "@/components/Icons/AddIcon";

type CommentDialogProps = {
	dialog: RefObject<DialogModalHandle>,
	project: Project | undefined | null,
	task: Task | undefined | null
}

export default function TagDialog({ dialog, project, task } : CommentDialogProps) {
	const [tags, setTags] = useState<Tag[]>(task?.tags ?? []);

	async function tag(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!tags || !task)
			return;

		const removed = task.tags.filter(t => !tags.some(tt => tt.id == t.id));
		const added = tags.filter(t => !task.tags.some(tt => tt.id == t.id));

		dialog.current?.hide();
		for (const t of removed) {
			await editTag(
				t.id,
				{ tasks: [{ type: "REMOVE", task: task.id }]}
			);
		}

		for (const t of added) {
			await editTag(
				t.id,
				{ tasks: [{ type: "ADD", task: task.id }]}
			);
		}

		event.currentTarget?.reset();
	}

	function isSelected(tag: Tag, set?: Tag[]) {
		return (set ?? tags).some(t => t.id === tag.id);
	}

	return (
		<>
			<Dialog.Modal onOpen={() => setTags(task?.tags ?? [])} ref={dialog}>
				<Dialog.Container>
					<Dialog.Column>
						<h2>
							Tag
						</h2>

						<p>
							Edit the tags linked to the current tasks from the parent project.
						</p>
					</Dialog.Column>

					<Dialog.Form onSubmit={tag}>
						<Dialog.Column>
							{project?.tags.map(t => (
								<Button
									key={t.id}
									onClick={() => setTags(prev => isSelected(t, prev) ? prev.filter(p => p.id !== t.id) : [...prev, t])}
									type={"square"}
									usage={"other"}
									intent={isSelected(t) ? "primary" : "tertiary"}
									className={"justify-between"}
								>
									{t.name}
									{isSelected(t) ? <ConfirmIcon className={"small-icon"}/> : <AddIcon className={"small-icon"}/>}
								</Button>
							))}
						</Dialog.Column>

						<Dialog.Row>
							<Button onClick={() => dialog.current?.hide()} type={"rounded"} usage={"other"} intent={"secondary"}>
								<RemoveIcon className={"small-icon"}/>
								Cancel
							</Button>
							<Button className={"w-full justify-center"} type={"rounded"} usage={"form"} intent={"primary"}>
								<ConfirmIcon className={"small-icon"}/>
								Confirm
							</Button>
						</Dialog.Row>
					</Dialog.Form>
				</Dialog.Container>
			</Dialog.Modal>
		</>
	);
}