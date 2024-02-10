import React, {RefObject, useCallback, useRef} from "react";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import Header from "@/components/Text/Header";
import MoreIcon from "@/components/Icons/MoreIcon";
import {Link, Project} from "@/lib/types";
import LinkIcon from "@/components/Icons/LinkIcon";
import UnlinkIcon from "@/components/Icons/UnlinkIcon";
import {unlinkTeam} from "@/lib/projects";

type LinkItemProps = {
	link: Link,
	project: Project
	isOwner: boolean
	className?: string
	editable?: boolean

	onChange?: () => void
}

export default function LinkItem({ link, project, isOwner, className, editable = true, onChange } : LinkItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const confirmationDialog = useRef<ConfirmationDialogHandle>(null);

	async function removeLink() {
		confirmationDialog?.current?.show(
			"Unlink team",
			"Are you sure you want to unlink the given team?",
			async () => {
				if (!link || !project)
					return;

				await unlinkTeam(link.id, project?.id);
				if (onChange) onChange();
				popoverRef.current?.hide();
			}
		);
	}

	return (
		<>
			<div className={`flex flex-row items-center gap-[12px] bg-zinc-700 rounded-xl ${className}`}>
				<div className={"flex flex-row p-[16px] flex-grow items-center gap-[12px] rounded-xl focus:outline-none focus:ring-4 focus:ring-zinc-500"}>
					<div>
						<LinkIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
					</div>
					<div className={"flex flex-col flex-grow text-left"}>
						<Header>
							{link.name}
						</Header>
					</div>
				</div>

				{(editable && isOwner) && (
					<Popover>
						<button className={"mr-[16px] focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"} onClick={() => popoverRef.current?.toggle()}>
							<MoreIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
						</button>
						<Popover.Modal ref={popoverRef}>
							<Popover.Container>
								<Popover.Button focus onClick={async () => await removeLink()}>
									<Header className={"text-zinc-700"}>
										Unlink
									</Header>
									<UnlinkIcon className={"w-[24px] h-[24px]"}/>
								</Popover.Button>
							</Popover.Container>
						</Popover.Modal>
					</Popover>
				)}
			</div>

			<ConfirmationDialog ref={confirmationDialog} />
		</>
	);
}