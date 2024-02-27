import React, {FormEvent, RefObject, useCallback, useRef, useState} from "react";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import {useUser} from "@/lib/hooks";
import TeamIcon from "@/components/Icons/TeamIcon";
import Header from "@/components/Text/Header";
import MoreIcon from "@/components/Icons/MoreIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import EditIcon from "@/components/Icons/EditIcon";
import {Invite, Member, Team} from "@/lib/types";
import UserIcon from "@/components/Icons/UserIcon";
import {kickTeamMember, leaveTeam, removeTeam, revokeTeamInvite, sendTeamInvite} from "@/lib/teams";
import Sheet, {SheetModalHandle} from "@/components/Input/Modals/Sheet";
import Title from "@/components/Text/Title";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import MemberItem from "@/components/App/Projects/MemberItem";
import Subtitle from "@/components/Text/Subtitle";
import AddIcon from "@/components/Icons/AddIcon";
import InviteMemberDialog from "@/components/App/Dialogs/Members/InviteMemberDialog";
import {SentInviteItem} from "@/components/App/Projects/InviteItem";
import SignOutIcon from "@/components/Icons/SignOutIcon";
import EditTeamDialog from "@/components/App/Dialogs/Teams/EditTeamDialog";

type TeamItemProps = {
	team: Team,
	className?: string,
	editable?: boolean,

	onClick?: () => void,
}

export default function TeamItem({ team, className, editable = true, onClick } : TeamItemProps) {
	const [inviteError, setInviteError] = useState<string | null>();

	const popoverRef = useRef<PopoverModalHandle>(null);
	const sheetRef = useRef<SheetModalHandle>(null);
	const confirmationDialog = useRef<ConfirmationDialogHandle>(null);

	const editDialogRef = useRef<DialogModalHandle>(null);
	const inviteDialogRef = useRef<DialogModalHandle>(null);

	const { user } = useUser();

	const isOwner = useCallback(() => team.owner.userId == user?.id, [team, user]);

	function owner(member: Member) {
		return team.owner.userId == member.userId;
	}

	async function remove() {
		confirmationDialog?.current?.show(
			"Remove team",
			"Are you sure you want to remove the given team indefinitely?",
			async () => {
				await removeTeam(team.id);
				sheetRef.current?.hide();
				popoverRef.current?.hide();
			}
		);
	}

	async function leave() {
		if (!user) return;

		confirmationDialog?.current?.show(
			"Leave team",
			"Are you sure you want to leave the given team?",
			async () => {
				sheetRef.current?.hide();
				popoverRef.current?.hide();
				await leaveTeam(team.id, user.id);
				sheetRef.current?.hide();
				popoverRef.current?.hide();
			}
		);
	}

	async function kick(dialog: RefObject<ConfirmationDialogHandle>, member: Member) {
		if (!user) return;

		dialog.current?.show(
			"Kick member",
			"Are you sure you want to kick the given member from the team?",
			async () => await kickTeamMember(team.id, member.userId)
		);
	}

	async function inviteUser(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setInviteError(null);

		const data = {
			email: String(event.currentTarget.Email.value),
		};

		if (!team)
			return;

		sendTeamInvite(team.id, data.email)
			.then(async result => {
				const root = result.data.sendTeamInvitation;
				if (root.errors) {
					setInviteError(root.errors[0].message);
					return;
				}

				inviteDialogRef.current?.hide();
			});
	}

	async function revokeInvite (dialog: RefObject<ConfirmationDialogHandle>, invite: Invite) {
		dialog.current?.show(
			"Revoke invite",
			"Are you sure you want to revoke the given invite?",
			async () => await revokeTeamInvite(team.id, invite.userId)
		);
	}

	return (
		<>
			<div className={`flex flex-row items-center gap-[12px] bg-zinc-700 rounded-xl ${className}`}>
				<button onClick={onClick ?? (() => sheetRef.current?.show())} className={"card flex flex-row flex-grow items-center gap-[12px] rounded-xl focus:outline-none focus:ring-4 focus:ring-zinc-500"}>
					<div>
						<TeamIcon className={"small-icon text-zinc-200"}/>
					</div>
					<div className={"flex flex-col flex-grow text-left"}>
						<h4>
							{team.name}
						</h4>
					</div>
				</button>

				{editable && (
					<Popover>
						<button className={"mr-[16px] focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"} onClick={() => popoverRef.current?.toggle()}>
							<MoreIcon className={"icon text-zinc-200"}/>
						</button>
						<Popover.Modal ref={popoverRef}>
							<Popover.Container>
								{isOwner() ? (
									<Popover.Button focus onClick={remove}>
										<h4 className={"text-zinc-700"}>
											Remove
										</h4>
										<DeleteIcon className={"icon"}/>
									</Popover.Button>
								) : (
									<Popover.Button focus onClick={leave}>
										<h4 className={"text-zinc-700"}>
											Leave
										</h4>
										<SignOutIcon className={"icon"}/>
									</Popover.Button>
								)}


								<Popover.Button onClick={() => inviteDialogRef.current?.show()}>
									<h4 className={"text-zinc-700"}>
										Invite
									</h4>
									<UserIcon className={"icon"}/>
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
				)}
			</div>

			<Sheet.Modal ref={sheetRef}>
				<Sheet.Container>
					<Sheet.Column>
						<h1>
							{team.name}
						</h1>
					</Sheet.Column>

					<Sheet.Column>
						<h3>
							Members
						</h3>
						{team.members?.toSorted((a, b) => owner(a) && owner(b) ? 0 : owner(a) ? -1 : 1).map(m => (
							<MemberItem
								member={m}
								isOwner={team.owner.userId === m.userId}

								onKick={kick}
								onLeave={leave}
							/>
						))}
						{team.invites?.map(i => (
							<SentInviteItem
								key={i.userId}
								invite={i}

								onRevoke={revokeInvite}
							/>
						))}
					</Sheet.Column>

					<Sheet.Row>
						{isOwner() ? (
							<>
								<Button focus onClick={remove} type={"circle"} usage={"form"} intent={"secondary"}>
									<DeleteIcon className={"small-icon"}/>
								</Button>
								<Button onClick={() => editDialogRef.current?.show()} type={"circle"} usage={"form"} intent={"secondary"}>
									<EditIcon className={"small-icon"}/>
								</Button>
							</>
						) : (
							<Button focus onClick={leave} type={"circle"} usage={"form"} intent={"secondary"}>
								<SignOutIcon className={"small-icon"}/>
							</Button>
						)}
						<Button onClick={() => inviteDialogRef.current?.show()} type={"circle"} usage={"form"} intent={"secondary"}>
							<AddIcon className={"small-icon"}/>
						</Button>
						<Button onClick={() => sheetRef.current?.hide()} type={"rounded"} usage={"form"} intent={"primary"} className={"flex-grow justify-center"}>
							<RemoveIcon className={"small-icon"}/>
							Close
						</Button>
					</Sheet.Row>
				</Sheet.Container>
			</Sheet.Modal>

			<ConfirmationDialog ref={confirmationDialog} />

			<InviteMemberDialog
				dialog={inviteDialogRef}
				error={inviteError}
				setError={setInviteError}

				onInvite={inviteUser}
			/>

			<EditTeamDialog
				dialog={editDialogRef}
				team={team}
			/>
		</>
	);
}