import {Invite, Member, Project} from "@/lib/types";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import React, {FormEvent, RefObject, useRef, useState} from "react";
import MemberItem from "@/components/App/Items/MemberItem";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import {kickProjectMember, leaveProject, revokeProjectInvite, sendProjectInvite} from "@/lib/projects";
import {SentInviteItem} from "@/components/App/Items/InviteItem";
import {useRouter} from "next/navigation";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import InviteMemberDialog from "@/components/App/Dialogs/Members/InviteMemberDialog";

type TeamDialogProps = {
	dialog: RefObject<DialogModalHandle>
	project: Project | null
}

export default function MemberDialog({ dialog, project } : TeamDialogProps) {
	const inviteDialogRef = useRef<DialogModalHandle>(null);
	const [inviteError, setInviteError] = useState<string | null>();

	const { push } = useRouter();

	async function inviteUser(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setInviteError(null);

		const data = {
			email: String(event.currentTarget.Email.value),
		};

		if (!project)
			return;

		sendProjectInvite(project.id, data.email)
			.then(async result => {
				const root = result.data.sendProjectInvitation;
				if (root.errors) {
					setInviteError(root.errors[0].message);
					return;
				}

				inviteDialogRef.current?.hide();
			});
	}

	function leave(dialog: RefObject<ConfirmationDialogHandle>, member: Member) {
		if (!project)
			return;

		dialog.current?.show(
			"Leave project",
			"Are you sure you want to leave the given project?",
			() => {
				leaveProject(project.id, member.userId)
					.then(async result => {
						const root = result.data.leaveProject;
						if (root.errors) return;

						push("/app/projects");
					});
			}
		);
	}

	function kick(dialog: RefObject<ConfirmationDialogHandle>, member: Member) {
		if (!project)
			return;

		dialog.current?.show(
			"Kick member",
			"Are you sure you want to kick the given member from the project?",
			async () => await kickProjectMember(project.id, member.userId)
		);
	}

	function revoke(dialog: RefObject<ConfirmationDialogHandle>, invite: Invite) {
		if (!project)
			return;

		dialog.current?.show(
			"Revoke invite",
			"Are you sure you want to revoke the given invite?",
			async () => await revokeProjectInvite(project.id, invite.userId)
		);
	}

	return (
		<>
			<Dialog.Modal ref={dialog}>
				<Dialog.Container>
					<Dialog.Column>
						<h2>
							Members
						</h2>

						<p>
							Adjust the members of the project, adding or removing new users.
						</p>
					</Dialog.Column>

					<Dialog.Column>
						{project?.members?.map(m => (
							<MemberItem
								key={m.userId}

								member={m}
								isOwner={project.owner.userId === m.userId}

								onLeave={leave}
								onKick={kick}
							/>
						))}

						{project?.invites?.map(i => (
							<SentInviteItem
								key={i.userId}
								invite={i}

								onRevoke={revoke}
							/>
						))}
						
						<Button onClick={() => inviteDialogRef.current?.show()} type={"square"} usage={"form"} intent={"primary"} className={"flex flex-grow justify-center"}>
							<AddIcon className={"small-icon"}/>
						</Button>
					</Dialog.Column>
					
					<Dialog.Row>
						<Button focus onClick={() => dialog.current?.hide()} type={"rounded"} usage={"form"} intent={"secondary"} className={"flex flex-grow justify-center"}>
							<RemoveIcon className={"small-icon"}/>
							Close
						</Button>
					</Dialog.Row>
				</Dialog.Container>
			</Dialog.Modal>

			<InviteMemberDialog
				dialog={inviteDialogRef}
				error={inviteError}
				setError={setInviteError}

				onInvite={inviteUser}
			/>
		</>
	);
}

