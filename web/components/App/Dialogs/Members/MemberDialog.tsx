import {Invite, Member, Project} from "@/lib/types";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import React, {FormEvent, RefObject, useRef, useState} from "react";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import MemberItem from "@/components/App/Projects/MemberItem";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import {kickProjectMember, leaveProject, revokeProjectInvite, sendProjectInvite} from "@/lib/projects";
import {SentInviteItem} from "@/components/App/Projects/ProjectInviteItem";
import {useRouter} from "next/navigation";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import InviteMemberDialog from "@/components/App/Dialogs/Members/InviteMemberDialog";

type TeamDialogProps = {
	dialog: RefObject<DialogModalHandle>
	project: Project |  undefined

	onUpdate: () => void,
}

export default function MemberDialog({ dialog, onUpdate, project } : TeamDialogProps) {
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
				onUpdate();
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
			() => {
				kickProjectMember(project.id, member.userId)
					.then(async result => {
						const root = result.data.kickProjectMember;
						if (root.errors) return;
						onUpdate();
					});
			}
		);
	}

	function revoke(dialog: RefObject<ConfirmationDialogHandle>, invite: Invite) {
		if (!project)
			return;

		dialog.current?.show(
			"Revoke invite",
			"Are you sure you want to revoke the given invite?",
			() => {
				revokeProjectInvite(project.id, invite.userId)
					.then(async result => {
						const root = result.data.revokeProjectInvitation;
						if (root.errors) return;

						onUpdate();
					});
			}
		);
	}

	return (
		<>
			<Dialog.Modal ref={dialog}>
				<Dialog.Container>
					<Dialog.Column>
						<Title context={"dialog"}>
							Members
						</Title>

						<Description>
							Adjust the members of the project, adding or removing new users.
						</Description>
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
							<AddIcon className={"w-[16px] h-[16px]"}/>
						</Button>
					</Dialog.Column>
					
					<Dialog.Row>
						<Button focus onClick={() => dialog.current?.hide()} type={"rounded"} usage={"form"} intent={"secondary"} className={"flex flex-grow justify-center"}>
							<RemoveIcon className={"w-[16px] h-[16px]"}/>
							Close
						</Button>
					</Dialog.Row>
				</Dialog.Container>
			</Dialog.Modal>

			<InviteMemberDialog
				dialog={inviteDialogRef}
				error={inviteError}

				onInvite={inviteUser}
			/>
		</>
	);
}

