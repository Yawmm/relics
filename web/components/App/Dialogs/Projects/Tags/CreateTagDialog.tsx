import React, {FormEvent, RefObject} from "react";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import {Project} from "@/lib/types";
import {addTag} from "@/lib/tags";

type TagDialogProps = {
	dialog: RefObject<DialogModalHandle>
	project: Project | null
}

export default function CreateTagDialog({ dialog, project } : TagDialogProps) {
	async function createTag(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		
		if (!project)
			return;

		const data = {
			name: String(event.currentTarget.Name.value),
			color: String(event.currentTarget.Color.value)
		};

		dialog.current?.hide();
		await addTag(data.name, data.color, project.id);
		event.currentTarget?.reset();
	}

	return (
		<Dialog.Modal ref={dialog}>
			<Dialog.Container>
				<Dialog.Column>
					<h2>
						Create tag
					</h2>

					<p>
						Add tags to filter tasks based on priority or other functions.
					</p>
				</Dialog.Column>

				<Dialog.Form onSubmit={createTag}>
					<Dialog.Column>
						<InputField
							focus
							maximum={20}
							type={"form"}
							title={"Name"}
							placeholder={"Default tag"}
							required={true}
						/>

						<InputField
							maximum={7}
							type={"color"}
							title={"Color"}
							placeholder={"#ffffff"}
							required={true}
						/>
					</Dialog.Column>

					<Dialog.Row>
						<Button onClick={() => dialog.current?.hide()} type={"rounded"} usage={"form"} intent={"secondary"}>
							<RemoveIcon className={"small-icon"}/>
							Cancel
						</Button>

						<Button className={"w-full justify-center"} type={"rounded"} usage={"form"} intent={"primary"}>
							<ConfirmIcon className={"small-icon"}/>
							Confirm
						</Button>
					</Dialog.Row>
				</Dialog.Form>
			</Dialog.Container>
		</Dialog.Modal>
	);
}