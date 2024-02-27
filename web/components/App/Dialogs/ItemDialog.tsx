import React, {RefObject} from "react";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Button from "@/components/Input/Button";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";

type ItemDialogItem = {
	name: string,
	onSelect: () => void,
}

type ItemDialogProps = {
	dialog: RefObject<DialogModalHandle>
	items: ItemDialogItem[]
}

export default function ItemDialog({ dialog, items } : ItemDialogProps) {
	function dismiss(method?: () => void) {
		dialog.current?.hide();
		if (method) method();
	}

	return (
		<Dialog.Modal ref={dialog}>
			<Dialog.Container>
				<Dialog.Column>
					<h2>
						Create item
					</h2>

					<p>
						Add a new item to the project.
					</p>
				</Dialog.Column>

				<Dialog.Column>
					{items.map((item, i) => (
						<Button
							focus={i === 0}
							key={item.name}
							onClick={() => dismiss(item.onSelect)}
							className={"justify-between"}
							type={"square"}
							usage={"form"}
							intent={"primary"}
						>
							{item.name}
							<RightArrowIcon className={"small-icon"}/>
						</Button>
					))}
				</Dialog.Column>

				<Dialog.Row>
					<Button
						onClick={() => dialog.current?.hide()}
						className={"flex flex-grow justify-center"}
						type={"rounded"}
						usage={"form"}
						intent={"secondary"}
					>
						<RemoveIcon className={"small-icon"}/>
						Cancel
					</Button>
				</Dialog.Row>
			</Dialog.Container>
		</Dialog.Modal>
	);
}