import React, {FormEvent, RefObject} from "react";
import {Task, User} from "@/lib/types";
import {addComment} from "@/lib/tasks";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";

type CommentDialogProps = {
	dialog: RefObject<DialogModalHandle>,
	user: User | undefined | null,
	task: Task | undefined | null
}

export default function CreateCommentDialog({ dialog, user, task } : CommentDialogProps) {
	async function createComment(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		
		if (!user || !task)
			return;
		
		const data = {
			content: String(event.currentTarget.Content.value),
		};

		dialog.current?.hide();
		await addComment(
			data.content,
			task.id,
			user.id
		);
		event.currentTarget?.reset();
	}

	return (
		<>
			<Dialog.Modal ref={dialog}>
				<Dialog.Container>
					<Dialog.Column>
						<h2>
							Create comment
						</h2>

						<p>
							Add a comment to a task to create a discussion.
						</p>
					</Dialog.Column>

					<Dialog.Form onSubmit={createComment}>
						<Dialog.Column>
							<InputField
								focus
								type={"form"}
								title={"Content"}
								placeholder={"This is a default comment."}
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
		</>
	);
}