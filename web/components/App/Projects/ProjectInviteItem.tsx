import {Invite} from "@/lib/types";
import Header from "@/components/Text/Header";
import Description from "@/components/Text/Description";
import MoreIcon from "@/components/Icons/MoreIcon";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import React, {RefObject, useRef} from "react";
import Button from "@/components/Input/Button";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import UserIcon from "@/components/Icons/UserIcon";

type SentProjectInviteItemProps = {
	invite: Invite,

	onRevoke: (dialog: RefObject<ConfirmationDialogHandle>, invite: Invite) => void,

	className?: string,
}

export function SentInviteItem({ invite, onRevoke, className } : SentProjectInviteItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);

	return (
		<>
			<div className={`flex flex-row items-center gap-[12px] p-[16px] bg-zinc-900 rounded-xl ${className}`}>
				<div className={"flex flex-row flex-grow items-center gap-[12px]"}>
					<div>
						<UserIcon className={"w-[24px] h-[24px] text-zinc-400"}/>
					</div>
					<div className={"flex flex-col flex-grow text-left"}>
						<Header className={"text-zinc-400"}>
							{invite.username}
						</Header>
						<Description>
							{invite.email}
						</Description>
					</div>

					<Popover>
						<button className={"focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"}
								onClick={() => popoverRef.current?.show()}>
							<MoreIcon className={"w-[24px] h-[24px] text-zinc-400"}/>
						</button>

						<Popover.Modal ref={popoverRef}>
							<Popover.Container>
								<Popover.Button focus onClick={() => onRevoke(confirmationDialogRef, invite)}>
									<Header className={"text-zinc-700"}>
										Revoke
									</Header>
									<DeleteIcon className={"w-[24px] h-[24px]"}/>
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

type ReceivedProjectInviteItemProps = {
	onAccept: () => void,
	onDecline: () => void,

	content: JSX.Element

	className?: string,
}

export function ReceivedInviteItem({onAccept, onDecline, content, className}: ReceivedProjectInviteItemProps) {
	return (
		<div className={`flex flex-row items-center gap-[12px] p-[16px] bg-zinc-700 rounded-xl ${className}`}>
			<div className={"flex flex-row flex-grow items-center gap-[12px]"}>
				{content}

				<div className={"flex flex-row gap-[12px]"}>
					<Button onClick={() => onDecline()}
							className={"flex h-fit bg-zinc-800 hover:bg-zinc-600 active:bg-zinc-900"} intent={"other"}
							type={"circle"} usage={"other"}>
						<RemoveIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
					</Button>
					<Button onClick={() => onAccept()} className={"flex h-fit"} intent={"primary"} type={"circle"}
							usage={"other"}>
						<ConfirmIcon className={"w-[24px] h-[24px]"}/>
					</Button>
				</div>
			</div>
		</div>
	);
}