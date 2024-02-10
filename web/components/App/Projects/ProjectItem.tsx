import {Project} from "@/lib/types";
import Header from "@/components/Text/Header";
import MoreIcon from "@/components/Icons/MoreIcon";
import Description from "@/components/Text/Description";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import EditIcon from "@/components/Icons/EditIcon";
import React, {RefObject, useCallback, useRef} from "react";
import {leaveProject, removeProject} from "@/lib/projects";
import ProjectIcon from "@/components/Icons/ProjectIcon";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import EditProjectDialog from "@/components/App/Dialogs/Projects/EditProjectDialog";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {useUser} from "@/lib/hooks";
import SignOutIcon from "@/components/Icons/SignOutIcon";

type ProjectItemProps = {
	project: Project,

	confirmationDialog?: RefObject<ConfirmationDialogHandle>,
	className?: string,
	editable?: boolean,

	onClick?: () => void,
	onUpdate?: () => void
}

export default function ProjectItem({ project, confirmationDialog, className, editable = true, onClick, onUpdate } : ProjectItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const editDialogRef = useRef<DialogModalHandle>(null);
	
	const { user } = useUser();
	const isOwner = useCallback(() => project.owner.userId == user?.id, [project, user]);
	const isIndirectMember = useCallback(() => project.links.some(l => l.members.some(m => m.userId == user?.id)), [project, user]);

	async function remove() {
		confirmationDialog?.current?.show(
			"Remove project",
			"Are you sure you want to remove the given project indefinitely?",
			async () => {
				await removeProject(project.id);
				if (onUpdate) onUpdate();
			}
		);
	}

	async function leave() {
		if (!user) return;
		confirmationDialog?.current?.show(
			"Leave project",
			"Are you sure you want to leave the given project?",
			async () => {
				await leaveProject(project.id, user.id);
				if (onUpdate) onUpdate();
			}
		);
	}

	return (
		<>
			<div className={`flex flex-row items-center gap-[12px] bg-zinc-700 rounded-xl ${className}`}>
				<button onClick={onClick} className={"flex flex-row p-[16px] flex-grow items-center gap-[12px] rounded-xl focus:outline-none focus:ring-4 focus:ring-zinc-500"}>
					<div>
						<ProjectIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
					</div>
					<div className={"flex flex-col flex-grow text-left"}>
						<Header>
							{project.name}
						</Header>
						<Description>
							{project.description}
						</Description>
					</div>
				</button>
	
				{editable && (
					<Popover>
						<button className={"mr-[16px] focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"} onClick={() => popoverRef.current?.toggle()}>
							<MoreIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
						</button>
						<Popover.Modal ref={popoverRef}>
							<Popover.Container>
								{isOwner() ? (
									<Popover.Button focus onClick={remove}>
										<Header className={"text-zinc-700"}>
											Remove
										</Header>
										<DeleteIcon className={"w-[24px] h-[24px]"}/>
									</Popover.Button>
								) : !isIndirectMember() && (
									<Popover.Button focus onClick={leave}>
										<Header className={"text-zinc-700"}>
											Leave
										</Header>
										<SignOutIcon className={"w-[24px] h-[24px]"}/>
									</Popover.Button>
								)}
	
								<Popover.Button onClick={() => editDialogRef.current?.show()}>
									<Header className={"text-zinc-700"}>
										Edit
									</Header>
									<EditIcon className={"w-[24px] h-[24px]"}/>
								</Popover.Button>
							</Popover.Container>
						</Popover.Modal>
					</Popover>
					)}
			</div>
		
			<EditProjectDialog
				dialog={editDialogRef}
				project={project}
				
				onUpdate={() => onUpdate && onUpdate()}
			/>
		</>
	);
}