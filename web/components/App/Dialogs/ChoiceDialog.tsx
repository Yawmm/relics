import React, {RefObject} from "react";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";

type Choice = {
	id: string,
	name: string
}

type ChoiceDialogProps = {
	dialog: RefObject<DialogModalHandle>,
	options: Choice[],

	onSelectOption: (option: string) => void,
	onResetOption: () => void,
}

export default function ChoiceDialog({ dialog, options, onSelectOption, onResetOption } : ChoiceDialogProps) {
	function chooseItem(item: string | null) {
		dialog.current?.hide();

		if (item === null)
		{
			onResetOption();
			return;
		}

		onSelectOption(item);
	}

	return (
		<Dialog.Modal ref={dialog}>
			<Dialog.Container>
				<Dialog.Column>
					<h2>
						Link item
					</h2>

					<p>
						Choose one of the following options.
					</p>
				</Dialog.Column>

				<Dialog.Column>
					{options?.map(o => o && (
						<Button
							key={o.id}
							onClick={() => chooseItem(o.id)}
							type={"square"}
							usage={"other"}
							intent={"primary"}
							className={"justify-between"}
						>
							{o.name}
							<AddIcon className={"small-icon"}/>
						</Button>
					))}

					<Button
						onClick={() => chooseItem(null)}
						type={"square"}
						usage={"form"}
						intent={"primary"}
						className={"justify-between"}
					>
						None
						<RemoveIcon className={"small-icon"}/>
					</Button>
				</Dialog.Column>

				<Dialog.Column>
					<Button
						focus
						onClick={() => dialog.current?.hide()}
						type={"rounded"}
						usage={"form"}
						intent={"secondary"}
						className={"justify-center"}
					>
						<RemoveIcon className={"small-icon"}/>
						Cancel
					</Button>
				</Dialog.Column>
			</Dialog.Container>
		</Dialog.Modal>
	);
}