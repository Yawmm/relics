import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import React, {FormEvent, RefObject, useState} from "react";
import {Project, Tag} from "@/lib/types";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import AddIcon from "@/components/Icons/AddIcon";

export type ProjectFilter = {
	tags: Tag[]
}

type EditProjectDialogProps = {
	dialog: RefObject<DialogModalHandle>,
	initial: ProjectFilter | null,
	project: Project | null,

	onFilter: (filter: ProjectFilter | null) => void
}

export default function FilterProjectDialog({ dialog, initial, project, onFilter } : EditProjectDialogProps) {
	const [tags, setTags] = useState<Tag[]>(initial?.tags ?? []);

	function filter(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const result: ProjectFilter | null = tags?.length <= 0 ? null : {
			tags
		};

		onFilter(result);
		dialog.current?.hide();
	}

	function isSelected(tag: Tag, set?: Tag[]) {
		return (set ?? tags).some(t => t.id === tag.id);
	}

	return (
		<Dialog.Modal ref={dialog}>
			<Dialog.Container>
				<Dialog.Column>
					<h2>
						Filter project
					</h2>

					<p>
						Filter the tasks of the project on one of the available tags.
					</p>
				</Dialog.Column>

				<Dialog.Form onSubmit={filter}>
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
	);
}