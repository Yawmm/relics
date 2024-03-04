import {Tag, Task} from "@/lib/types";
import React, {RefObject, useRef} from "react";
import {editTag, removeTag} from "@/lib/tags";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import EditIcon from "@/components/Icons/EditIcon";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import EditTagDialog from "@/components/App/Dialogs/Projects/Tags/EditTagDialog";
import UnlinkIcon from "@/components/Icons/UnlinkIcon";

type TagItemProps = {
	tag: Tag,
	confirmationDialog: RefObject<ConfirmationDialogHandle>,

	task?: Task | undefined,
	className?: string,
}

export default function TagItem({ tag, task, confirmationDialog, className } : TagItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const anchorRef = useRef<HTMLButtonElement>(null);
	const editDialogRef = useRef<DialogModalHandle>(null);

	function deleteTag() {
		confirmationDialog.current?.show(
			"Remove tag",
			"Are you sure you want to remove the given tag indefinitely?",
			async () => await removeTag(tag.id)
		);
	}

	async function unlinkTag() {
		if (!tag || !task)
			return;

		confirmationDialog.current?.show(
			"Unlink tag",
			"Are you sure you want to unlink the given tag?",
			async () => await editTag(
				tag.id,
				{ tasks: [{ type: "REMOVE", task: task.id }]}
			)
		);
	}

	return (
		<>
			<Popover>
				<div className={`flex flex-row items-center text-left gap-[12px] rounded-xl ${className}`}>
					<button ref={anchorRef} onClick={() => popoverRef.current?.show()} className={`px-6 py-1 border-2 rounded-full`}
							style={{borderColor: tag.color, boxShadow: "0 0 1px transparent"}}>
						<p className={"text-zinc-200 whitespace-nowrap"}>
							{tag.name}
						</p>
					</button>
				</div>
				<Popover.Modal ref={popoverRef} anchor={anchorRef}>
					<Popover.Container>
						{task ? (
							<Popover.Button focus onClick={unlinkTag}>
								<h4 className={"text-zinc-700"}>
									Unlink
								</h4>
								<UnlinkIcon className={"icon"}/>
							</Popover.Button>
						) : (
							<Popover.Button focus onClick={deleteTag}>
								<h4 className={"text-zinc-700"}>
									Remove
								</h4>
								<DeleteIcon className={"icon"}/>
							</Popover.Button>
						)}

						<Popover.Button onClick={() => editDialogRef.current?.show()}>
							<h4 className={"text-zinc-700"}>
								Edit
							</h4>
							<EditIcon className={"icon"}/>
						</Popover.Button>
					</Popover.Container>
				</Popover.Modal>
			</Popover>

			<EditTagDialog dialog={editDialogRef} tag={tag} />
		</>
	);
}