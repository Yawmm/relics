import React, {useRef} from "react";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
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
}

export default function LinkItem({ link, project, isOwner, className, editable = true } : LinkItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const anchorRef = useRef<HTMLButtonElement>(null);

	const confirmationDialog = useRef<ConfirmationDialogHandle>(null);

	async function removeLink() {
		confirmationDialog?.current?.show(
			"Unlink team",
			"Are you sure you want to unlink the given team?",
			async () => {
				if (!link || !project)
					return;

				await unlinkTeam(link.id, project?.id);
				popoverRef.current?.hide();
			}
		);
	}

	return (
		<>
			<div className={`flex flex-row items-center gap-[12px] bg-zinc-700 rounded-xl ${className}`}>
				<div className={"card flex flex-row flex-grow items-center gap-[12px] rounded-xl focus:outline-none focus:ring-4 focus:ring-zinc-500"}>
					<div>
						<LinkIcon className={"small-icon text-zinc-200"}/>
					</div>
					<div className={"flex flex-col flex-grow text-left"}>
						<h4>
							{link.name}
						</h4>
					</div>
				</div>

				{(editable && isOwner) && (
					<Popover>
						<button ref={anchorRef} className={"mr-[16px] focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"} onClick={() => popoverRef.current?.toggle()}>
							<MoreIcon className={"icon text-zinc-200"}/>
						</button>
						<Popover.Modal ref={popoverRef} anchor={anchorRef}>
							<Popover.Container>
								<Popover.Button focus onClick={async () => await removeLink()}>
									<h4 className={"text-zinc-700"}>
										Unlink
									</h4>
									<UnlinkIcon className={"icon"}/>
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