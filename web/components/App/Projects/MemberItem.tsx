import {Member, Project} from "@/lib/types";
import Header from "@/components/Text/Header";
import Description from "@/components/Text/Description";
import MoreIcon from "@/components/Icons/MoreIcon";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import React, {useCallback, useRef} from "react";
import UserIcon from "@/components/Icons/UserIcon";
import KeyIcon from "@/components/Icons/KeyIcon";
import {kickProjectMember, leaveProject} from "@/lib/projects";
import {useUser} from "@/lib/hooks";
import {useRouter} from "next/navigation";
import SignOutIcon from "@/components/Icons/SignOutIcon";

type MemberItemProps = {
	project: Project,
	member: Member,

	onUpdate: () => void,

	className?: string,
}

export default function MemberItem({ project, member, onUpdate, className } : MemberItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	
	const { user } = useUser();
	const { push } = useRouter();

	const isOwner = useCallback(() => project.owner.userId === member.userId, [project, member]);
	const isSelf = useCallback(() => member.userId === user?.id, [project, user]);
	
	async function submit() {
		if (!member || !project)
			return;

		if (isSelf()) {
			leaveProject(project.id, member.userId)
				.then(async result => {
					let root = result.data.leaveProject;
					if (!root.errors) {
						await push("/app/projects")
					}
				})

			return;
		}

		kickProjectMember(project.id, member.userId)
			.then(async result => {
				let root = result.data.kickProjectMember;
				if (!root.errors) {
					onUpdate()
				}
			})
	}

	return (
		<div className={`flex flex-row items-center gap-[12px] p-[16px] bg-zinc-700 rounded-xl ${className}`}>
			<div className={"flex flex-row flex-grow items-center gap-[12px]"}>
				<div>
					{isOwner() ? (
						<KeyIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
					) : (
						<UserIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
					)}
				</div>
				<div className={"flex flex-col flex-grow text-left"}>
					<Header>
						{member.username}
					</Header>
					<Description>
						{member.email}
					</Description>
				</div>

				{!isOwner() && (
					<Popover>
						<button className={"focus:outline-none focus:rounded-md focus:ring-2 focus:ring-main-500"} onClick={() => popoverRef.current?.toggle()}>
							<MoreIcon className={"w-[24px] h-[24px] text-zinc-200"} />
						</button>
						
						<Popover.Modal ref={popoverRef}>
							<Popover.Container>
								<Popover.Button focus onClick={() => submit()}>
									<Header>
										{isSelf() ? "Leave" : "Remove"}
									</Header>
									<SignOutIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
								</Popover.Button>
							</Popover.Container>
						</Popover.Modal>
					</Popover>
				)}
			</div>
		</div>
	)
}