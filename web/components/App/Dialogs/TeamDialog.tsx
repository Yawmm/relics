import {Project} from "@/lib/types";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import React, {RefObject, useRef, useState} from "react";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import MemberItem from "@/components/App/Projects/MemberItem";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import InputField from "@/components/Input/InputField";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import {sendProjectInvite} from "@/lib/projects";
import {SentInviteItem} from "@/components/App/Projects/InviteItem";
import AddMemberIcon from "@/components/Icons/AddMemberIcon";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

type TeamDialogProps = {
	dialog: RefObject<DialogModalHandle>
	project: Project |  undefined

	onUpdate: () => void,
}

export default function TeamDialog({ dialog, onUpdate, project } : TeamDialogProps) {
	const inviteDialogRef = useRef<DialogModalHandle>(null);

	const [inviteError, setInviteError] = useState<string | null>();

	async function inviteUser(event: any) {
		event.preventDefault()
		setInviteError(null)

		let data = {
			email: String(event.currentTarget.Email.value),
		}

		if (!project)
			return;

		sendProjectInvite(project.id, data.email)
			.then(async result => {
				let root = result.data.sendProjectInvitation;
				if (root.errors) {
					setInviteError(root.errors[0].message)
				} else {
					inviteDialogRef.current?.hide();
					onUpdate()
				}
			})
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
								project={project}
								member={m}

								onUpdate={onUpdate}
							/>
						))}

						{project?.invites?.map(i => (
							<SentInviteItem
								key={i.userId}
								project={project}
								invite={i}

								onUpdate={onUpdate}
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

			<Dialog.Modal ref={inviteDialogRef}>
				<Dialog.Container>
					<Dialog.Column>
						<Title>
							Invite user
						</Title>

						<Description>
							Invite a new user to the project.
						</Description>
					</Dialog.Column>

					<Dialog.Form onSubmit={inviteUser}>
						<Dialog.Column>
							<InputField focus title={"Email"} placeholder={"example@gmail.com"} type={"email"} required />
						</Dialog.Column>

						{inviteError && (
							<div className={"flex flex-row items-center gap-[12px] p-[12px] border-red-500 border-2 rounded-xl"}>
								<RemoveIcon className={"text-red-500 w-[36px] h-[36px]"} />
								<p className={"font-semibold text-sm text-red-500"}>{inviteError}</p>
							</div>
						)}

						<Dialog.Row>
							<Button onClick={() => inviteDialogRef.current?.hide()} type={"rounded"} usage={"other"} intent={"secondary"} className={"justify-center"}>
								<RemoveIcon className={"w-[16px] h-[16px] text-zinc-200"}/>
								Cancel
							</Button>
							<Button type={"rounded"} usage={"form"} intent={"primary"} className={"flex flex-grow justify-center"}>
								<ConfirmIcon className={"w-[16px] h-[16px] text-zinc-200"}/>
								Confirm
							</Button>
						</Dialog.Row>
					</Dialog.Form>
				</Dialog.Container>
			</Dialog.Modal>
		</>
	)
}

