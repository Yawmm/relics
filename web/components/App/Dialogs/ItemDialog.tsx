import React, {RefObject} from "react";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
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
		dialog.current?.hide()
		if (method) method()
	}

	return (
		<Dialog.Modal ref={dialog}>
			<Dialog.Container>
				<Dialog.Column>
					<Title context={"dialog"}>
						Create item
					</Title>

					<Description>
						Add a new item to the project.
					</Description>
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
							<RightArrowIcon className={"w-[16px] h-[16px]"}/>
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
						<RemoveIcon className={"w-[16px] h-[16px]"}/>
						Cancel
					</Button>
				</Dialog.Row>
			</Dialog.Container>
		</Dialog.Modal>
	)
}