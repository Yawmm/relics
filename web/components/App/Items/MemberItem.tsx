import {Member} from "@/lib/types";
import MoreIcon from "@/components/Icons/MoreIcon";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import React, {RefObject, useCallback, useRef} from "react";
import UserIcon from "@/components/Icons/UserIcon";
import KeyIcon from "@/components/Icons/KeyIcon";
import {useUser} from "@/lib/hooks";
import SignOutIcon from "@/components/Icons/SignOutIcon";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";

type MemberItemProps = {
	member: Member,
	isOwner: boolean,

	onLeave: (dialog: RefObject<ConfirmationDialogHandle>, member: Member) => void,
	onKick: (dialog: RefObject<ConfirmationDialogHandle>, member: Member) => void,

	className?: string,
}

export default function MemberItem({ member, isOwner, onLeave, onKick, className } : MemberItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const anchorRef = useRef<HTMLButtonElement>(null);

	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	
	const { user } = useUser();

	const isSelf = useCallback(() => member.userId === user?.id, [member, user]);
	
	async function submit() {
		if (!member) return;

		if (isSelf()) {
			onLeave(confirmationDialogRef, member);
			return;
		}

		onKick(confirmationDialogRef, member);
	}

	return (
		<>
			<div className={`card flex flex-row items-center gap-[12px] bg-zinc-700 rounded-xl ${className}`}>
				<div className={"flex flex-row flex-grow items-center gap-[12px]"}>
					<div>
						{isOwner ? (
							<KeyIcon className={"icon text-zinc-200"}/>
						) : (
							<UserIcon className={"icon text-zinc-200"}/>
						)}
					</div>
					<div className={"flex flex-col flex-grow text-left"}>
						<h4>
							{member.username}
						</h4>
						<p>
							{member.email}
						</p>
					</div>

					{!isOwner && (
						<Popover>
							<button ref={anchorRef} className={"focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"}
									onClick={() => popoverRef.current?.toggle()}>
								<MoreIcon className={"icon text-zinc-200"}/>
							</button>

							<Popover.Modal ref={popoverRef} anchor={anchorRef}>
								<Popover.Container>
									<Popover.Button focus onClick={() => submit()}>
										<h4 className={"text-zinc-700"}>
											{isSelf() ? "Leave" : "Remove"}
										</h4>
										<SignOutIcon className={"icon"}/>
									</Popover.Button>
								</Popover.Container>
							</Popover.Modal>
						</Popover>
					)}
				</div>
			</div>

			<ConfirmationDialog ref={confirmationDialogRef}/>
		</>
	);
}