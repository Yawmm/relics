import React, {FormEvent, RefObject} from "react";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import InputField from "@/components/Input/InputField";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import Button from "@/components/Input/Button";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";

type InviteMemberDialogProps = {
	dialog: RefObject<DialogModalHandle>,
	error: string | undefined | null,
	setError: React.Dispatch<React.SetStateAction<string | undefined | null>>,

	onInvite: (event: FormEvent<HTMLFormElement>) => void,
}

export default function InviteMemberDialog({ dialog, error, setError, onInvite } : InviteMemberDialogProps) {
	return (
		<Dialog.Modal onClose={() => setError(null)} ref={dialog}>
			<Dialog.Container>
				<Dialog.Column>
					<h2>
						Invite user
					</h2>

					<p>
						Invite a new user.
					</p>
				</Dialog.Column>

				<Dialog.Form onSubmit={onInvite}>
					<Dialog.Column>
						<InputField focus title={"Email"} placeholder={"example@gmail.com"} type={"email"} required />
					</Dialog.Column>

					{error && (
						<div className={"flex flex-row items-center gap-[12px] p-[12px] border-red-500 border-2 rounded-xl"}>
							<RemoveIcon className={"text-red-500 w-[36px] h-[36px]"} />
							<p className={"font-semibold text-sm text-red-500"}>{error}</p>
						</div>
					)}

					<Dialog.Row>
						<Button onClick={() => dialog.current?.hide()} type={"rounded"} usage={"other"} intent={"secondary"} className={"justify-center"}>
							<RemoveIcon className={"small-icon text-zinc-200"}/>
							Cancel
						</Button>
						<Button type={"rounded"} usage={"form"} intent={"primary"} className={"flex flex-grow justify-center"}>
							<ConfirmIcon className={"small-icon text-zinc-200"}/>
							Confirm
						</Button>
					</Dialog.Row>
				</Dialog.Form>
			</Dialog.Container>
		</Dialog.Modal>
	);
}