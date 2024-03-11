import {Invite} from "@/lib/types";
import MoreIcon from "@/components/Icons/MoreIcon";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import React, {RefObject, useRef} from "react";
import Button from "@/components/Input/Button";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import UserIcon from "@/components/Icons/UserIcon";

type SentInviteItemProps = {
	invite: Invite,

	onRevoke: (dialog: RefObject<ConfirmationDialogHandle>, invite: Invite) => void,

	className?: string,
}

export function SentInviteItem({ invite, onRevoke, className } : SentInviteItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const anchorRef = useRef<HTMLButtonElement>(null);

	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);

	return (
		<>
			<div className={`card flex flex-row items-center gap-[12px] bg-zinc-900 rounded-xl ${className}`}>
				<div className={"flex flex-row flex-grow items-center gap-[12px]"}>
					<div>
						<UserIcon className={"icon text-zinc-400"}/>
					</div>
					<div className={"flex flex-col flex-grow text-left"}>
						<h4 className={"text-zinc-400"}>
							{invite.username}
						</h4>
						<p>
							{invite.email}
						</p>
					</div>

					<Popover>
						<button ref={anchorRef} className={"focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"}
								onClick={() => popoverRef.current?.show()}>
							<MoreIcon className={"icon text-zinc-400"}/>
						</button>

						<Popover.Modal ref={popoverRef} anchor={anchorRef}>
							<Popover.Container>
								<Popover.Button focus onClick={() => onRevoke(confirmationDialogRef, invite)}>
									<h4 className={"text-zinc-700"}>
										Revoke
									</h4>
									<DeleteIcon className={"icon"}/>
								</Popover.Button>
							</Popover.Container>
						</Popover.Modal>
					</Popover>
				</div>
			</div>

			<ConfirmationDialog ref={confirmationDialogRef}/>
		</>
	);
}

type ReceivedInviteItemProps = {
	onAccept: () => void,
	onDecline: () => void,

	content: JSX.Element

	className?: string,
}

export function ReceivedInviteItem({onAccept, onDecline, content, className}: ReceivedInviteItemProps) {
	return (
		<div className={"flex flex-row w-full bg-zinc-50 rounded-xl"}>
			<div className={"flex flex-row flex-grow min-h-full gap-[8px] p-[8px]"}>
				<Button onClick={() => onDecline()}
						className={"flex flex-grow h-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900"}
						intent={"other"}
						type={"rounded"} usage={"other"}>
					<RemoveIcon className={"small-icon text-zinc-200"}/>
				</Button>
				<Button onClick={() => onAccept()} className={"flex flex-grow h-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900"}
						intent={"primary"}
						type={"rounded"}
						usage={"other"}>
					<ConfirmIcon className={"small-icon text-zinc-200"}/>
				</Button>
			</div>
			<div className={`card flex flex-row w-full items-center gap-[12px] bg-zinc-700 rounded-xl ${className}`}>
				<div className={"flex flex-row flex-grow items-center gap-[12px]"}>
					{content}
				</div>
			</div>
		</div>
	);
}