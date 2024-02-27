import React, {FormEvent, RefObject} from "react";
import {addCategory} from "@/lib/projects";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import {Project} from "@/lib/types";

type CategoryDialogProps = {
	dialog: RefObject<DialogModalHandle>
	project: Project | null
}

export default function CategoryDialog({ dialog, project } : CategoryDialogProps) {
	async function createCategory(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		
		if (!project)
			return;

		const data = {
			name: String(event.currentTarget.Name.value)
		};

		dialog.current?.hide();
		await addCategory(data.name, project.id);
		event.currentTarget?.reset();
	}

	return (
		<Dialog.Modal ref={dialog}>
			<Dialog.Container>
				<Dialog.Column>
					<h2>
						Create category
					</h2>

					<p>
						Add categories to group and manager your tasks more efficiently.
					</p>
				</Dialog.Column>

				<Dialog.Form onSubmit={createCategory}>
					<Dialog.Column>
						<InputField
							focus
							maximum={20}
							type={"form"}
							title={"Name"}
							placeholder={"Default category"}
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