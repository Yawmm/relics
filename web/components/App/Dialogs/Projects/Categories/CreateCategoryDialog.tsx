import React, {FormEvent, RefObject} from "react";
import {addCategory} from "@/lib/projects";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
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
					<Title context={"dialog"}>
						Create category
					</Title>

					<Description>
						Add categories to group and manager your tasks more efficiently.
					</Description>
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
							<RemoveIcon className={"w-[16px] h-[16px]"}/>
							Cancel
						</Button>

						<Button className={"w-full justify-center"} type={"rounded"} usage={"form"} intent={"primary"}>
							<ConfirmIcon className={"w-[16px] h-[16px]"}/>
							Confirm
						</Button>
					</Dialog.Row>
				</Dialog.Form>
			</Dialog.Container>
		</Dialog.Modal>
	);
}