import {Category, Project} from "@/lib/types";
import AddIcon from "@/components/Icons/AddIcon";
import MoreIcon from "@/components/Icons/MoreIcon";
import React, {RefObject, useRef} from "react";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import EditIcon from "@/components/Icons/EditIcon";
import TaskItem from "@/components/App/Items/TaskItem";
import {removeCategory} from "@/lib/projects";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import EditCategoryDialog from "@/components/App/Dialogs/Projects/Categories/EditCategoryDialog";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";

type CategoryItemProps = {
	category: Category,
	project: Project,
	confirmationDialog: RefObject<ConfirmationDialogHandle>,

	onAdd?: (category: Category) => void,
}

export default function CategoryItem({ category, project, confirmationDialog, onAdd } : CategoryItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const anchorRef = useRef<HTMLButtonElement>(null);

	const editDialogRef = useRef<DialogModalHandle>(null);

	async function deleteCategory() {
		confirmationDialog.current?.show(
			"Remove category",
			"Are you sure you want to remove the given category indefinitely?",
			async () => {
				await removeCategory(category.id);
			}
		);
	}

	return (
		<>
			<div className={"flex flex-col h-fit min-w-full snap-center bg-zinc-800 border-zinc-700 border-2 rounded-lg"}>
				<div className={"flex flex-row justify-between px-[24px] md:px-[36px] pt-[24px] md:pt-[36px] pb-[16px] md:pb-[24px]"}>
					<h3>
						{category.name}
					</h3>
	
					<div className={"flex flex-row gap-[12px] items-center"}>
						<button className={"focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"} onClick={() => onAdd && onAdd(category)}>
							<AddIcon className={"icon text-zinc-200"} />
						</button>
						<Popover>
							<button ref={anchorRef} className={"flex focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"} onClick={() => popoverRef.current?.toggle()}>
								<MoreIcon className={"icon text-zinc-200"} />
							</button>
	
							<Popover.Modal ref={popoverRef} anchor={anchorRef}>
								<Popover.Container>
									<Popover.Button focus onClick={async () => await deleteCategory()}>
										<h4 className={"text-zinc-700"}>
											Remove
										</h4>
										<DeleteIcon className={"icon"}/>
									</Popover.Button>
									<Popover.Button onClick={() => editDialogRef.current?.show()}>
										<h4 className={"text-zinc-700"}>
											Edit
										</h4>
										<EditIcon className={"icon"}/>
									</Popover.Button>
								</Popover.Container>
							</Popover.Modal>
						</Popover>
					</div>
				</div>
	
				<div className={"flex flex-col px-[24px] md:px-[36px] pb-[24px] md:pb-[26px] pt-[8px] md:pt-[12px] gap-[12px]"}>
					{category.tasks.length > 0
						? category.tasks?.map(t =>
							<TaskItem
								key={t.id}
								task={t}
								category={category}
								project={project}
								confirmationDialog={confirmationDialog}
							/>
							)
						: (
							<p>
								No tasks are linked to this category.
							</p>
						)
					}
				</div>
			</div>
		
			<EditCategoryDialog
				dialog={editDialogRef}
				category={category}
			/>
		</>
	);
}

