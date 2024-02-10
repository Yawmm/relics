import {Category} from "@/lib/types";
import Subtitle from "@/components/Text/Subtitle";
import AddIcon from "@/components/Icons/AddIcon";
import MoreIcon from "@/components/Icons/MoreIcon";
import Description from "@/components/Text/Description";
import React, {RefObject, useRef} from "react";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import Header from "@/components/Text/Header";
import EditIcon from "@/components/Icons/EditIcon";
import TaskItem from "@/components/App/Projects/TaskItem";
import {removeCategory} from "@/lib/projects";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import EditCategoryDialog from "@/components/App/Dialogs/Projects/Categories/EditCategoryDialog";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";

type CategoryItemProps = {
	category: Category,
	confirmationDialog: RefObject<ConfirmationDialogHandle>,
	
	onAdd?: (category: Category) => void,
	onUpdate?: () => void
}

export default function CategoryItem({ category, confirmationDialog, onAdd, onUpdate } : CategoryItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const editDialogRef = useRef<DialogModalHandle>(null);

	async function deleteCategory() {
		confirmationDialog.current?.show(
			"Remove category",
			"Are you sure you want to remove the given category indefinitely?",
			async () => {
				await removeCategory(category.id);
				if (onUpdate) onUpdate();
			}
		);
	}

	return (
		<>
			<div className={"flex flex-col h-fit min-w-full snap-center bg-zinc-800 border-zinc-700 border-2 rounded-lg"}>
				<div className={"flex flex-row justify-between px-[24px] pt-[24px] pb-[16px]"}>
					<Subtitle>
						{category.name}
					</Subtitle>
	
					<div className={"flex flex-row gap-[12px] items-center"}>
						<button className={"focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"} onClick={() => onAdd && onAdd(category)}>
							<AddIcon className={"w-[24px] h-[24px] text-zinc-200"} />
						</button>
						<Popover>
							<button className={"flex focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"} onClick={() => popoverRef.current?.toggle()}>
								<MoreIcon className={"w-[24px] h-[24px] text-zinc-200"} />
							</button>
	
							<Popover.Modal ref={popoverRef}>
								<Popover.Container>
									<Popover.Button focus onClick={async () => await deleteCategory()}>
										<Header className={"text-zinc-700"}>
											Remove
										</Header>
										<DeleteIcon className={"w-[24px] h-[24px]"}/>
									</Popover.Button>
									<Popover.Button onClick={() => editDialogRef.current?.show()}>
										<Header className={"text-zinc-700"}>
											Edit
										</Header>
										<EditIcon className={"w-[24px] h-[24px]"}/>
									</Popover.Button>
								</Popover.Container>
							</Popover.Modal>
						</Popover>
					</div>
				</div>
	
				<div className={"flex flex-col px-[24px] pb-[24px] pt-[8px] gap-[12px]"}>
					{category.tasks.length > 0
						? category.tasks?.map(t =>
							<TaskItem
								key={t.id}
								task={t}
								confirmationDialog={confirmationDialog}
								
								onUpdate={onUpdate}
							/>
							)
						: (
							<Description>
								No tasks are linked to this category.
							</Description>
						)
					}
				</div>
			</div>
		
			<EditCategoryDialog
				dialog={editDialogRef}
				category={category}
				
				onUpdate={() => onUpdate && onUpdate()}
			/>
		</>
	);
}

