import React, {RefObject} from "react";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
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
					<Title context={"dialog"}>
						Link item
					</Title>

					<Description>
						Choose one of the following options.
					</Description>
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
							<AddIcon className={"w-[16px] h-[16px]"}/>
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
						<RemoveIcon className={"w-[16px] h-[16px]"}/>
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
						<RemoveIcon className={"w-[16px] h-[16px]"}/>
						Cancel
					</Button>
				</Dialog.Column>
			</Dialog.Container>
		</Dialog.Modal>
	);
}