import {Comment} from "@/lib/types";
import CommentIcon from "@/components/Icons/CommentIcon";
import Header from "@/components/Text/Header";
import Description from "@/components/Text/Description";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import React, {RefObject, useCallback, useRef} from "react";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {useUser} from "@/lib/hooks";
import {removeComment} from "@/lib/tasks";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import MoreIcon from "@/components/Icons/MoreIcon";

type CommentItemProps = {
	comment: Comment,
	confirmationDialog: RefObject<ConfirmationDialogHandle>,

	className?: string,
}

export default function CommentItem({ comment, confirmationDialog, className } : CommentItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	const { user } = useUser();
	
	const isOwner = useCallback(() => comment.owner.userId == user?.id, [comment, user]);

	function deleteComment() {
		confirmationDialog.current?.show(
			"Remove comment",
			"Are you sure you want to remove the given comment indefinitely?",
			async () => {
				popoverRef.current?.hide();
				await removeComment(comment.id);
			}
		);
	}

	return (
		<>
			<div className={`flex flex-row items-center text-left gap-[12px] bg-zinc-700 rounded-xl ${className}`}>
				<div className={"card flex flex-row flex-grow max-w-full items-center gap-[12px] md:gap-[24px] text-left rounded-xl focus:outline-none focus:ring-4 focus:ring-zinc-500"}>
					<div>
						<CommentIcon className={`icon text-zinc-200`}/>
					</div>
					<div className={`flex flex-col flex-grow overflow-ellipsis break-all text-left`}>
						<h4 className={"text-zinc-200"}>
							{comment.owner.username}
						</h4>
						<p className={"text-zinc-200"}>
							{comment.content}
						</p>
					</div>
					{isOwner() && (
						<Popover>
							<button className={"flex focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"} onClick={() => popoverRef.current?.toggle()}>
								<MoreIcon className={"icon text-zinc-200"} />
							</button>

							<Popover.Modal ref={popoverRef}>
								<Popover.Container>
									<Popover.Button focus onClick={deleteComment}>
										<h4 className={"text-zinc-700"}>
											Remove
										</h4>
										<DeleteIcon className={"icon"}/>
									</Popover.Button>
								</Popover.Container>
							</Popover.Modal>
						</Popover>
					)}
				</div>
			</div>
		</>
	);
}