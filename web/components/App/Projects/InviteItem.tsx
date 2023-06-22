"use client"

import {Invite, Project} from "@/lib/types";
import Header from "@/components/Text/Header";
import Description from "@/components/Text/Description";
import MoreIcon from "@/components/Icons/MoreIcon";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import React, {useRef, useState} from "react";
import AddMemberIcon from "@/components/Icons/AddMemberIcon";
import {acceptProjectInvite, declineProjectInvite, revokeProjectInvite} from "@/lib/projects";
import Button from "@/components/Input/Button";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import {useUser} from "@/lib/hooks";
import {pop} from "@jridgewell/set-array";

type SentInviteItemProps = {
	project: Project,
	invite: Invite,

	onUpdate: () => void,

	className?: string,
}

export function SentInviteItem({ project, invite, onUpdate, className } : SentInviteItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);

	async function revokeInvite() {
		if (!project)
			return;

		revokeProjectInvite(project.id, invite.userId)
			.then(async result => {
				let root = result.data.revokeProjectInvitation;
				if (root.errors) {
					return;
				} else {
					onUpdate()
				}
			})
	}

	return (
		<div className={`flex flex-row items-center gap-[12px] p-[16px] bg-zinc-900 rounded-xl ${className}`}>
			<div className={"flex flex-row flex-grow items-center gap-[12px]"}>
				<div>
					<AddMemberIcon className={"w-[24px] h-[24px] text-zinc-400"}/>
				</div>
				<div className={"flex flex-col flex-grow text-left"}>
					<Header className={"text-zinc-400"}>
						{invite.username}
					</Header>
					<Description>
						{invite.email}
					</Description>
				</div>

				<Popover>
					<button className={"focus:outline-none focus:rounded-md focus:ring-2 focus:ring-main-500"} onClick={() => popoverRef.current?.show()}>
						<MoreIcon className={"w-[24px] h-[24px] text-zinc-400"} />
					</button>

					<Popover.Modal ref={popoverRef}>
						<Popover.Container>
							<Popover.Button focus onClick={revokeInvite}>
								<Header>
									Remove
								</Header>
								<DeleteIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
							</Popover.Button>
						</Popover.Container>
					</Popover.Modal>
				</Popover>

			</div>
		</div>
	)
}

type ReceivedInviteItemProps = {
	project: Project,

	onUpdate: () => void,

	className?: string,
}

export function ReceivedInviteItem({ project, onUpdate, className } : ReceivedInviteItemProps) {
	const { user } = useUser();

	async function acceptInvite() {
		if (!user || !project)
			return;

		acceptProjectInvite(project.id, user.id)
			.then(async result => {
				let root = result.data.acceptProjectInvitation;
				if (root.errors) {
					return;
				} else {
					onUpdate()
				}
			})
	}

	async function declineInvite() {
		if (!user || !project)
			return;

		declineProjectInvite(project.id, user.id)
			.then(async result => {
				let root = result.data.declineProjectInvitation;
				if (root.errors) {
					return;
				} else {
					onUpdate()
				}
			})
	}

	return (
		<div className={`flex flex-row items-center gap-[12px] p-[16px] bg-zinc-700 rounded-xl ${className}`}>
			<div className={"flex flex-row flex-grow items-center gap-[12px]"}>
				<div>
					<AddMemberIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
				</div>
				<div className={"flex flex-col flex-grow text-left"}>
					<Header>
						{project.name}
					</Header>
					<Description>
						{project.description}
					</Description>
				</div>

				<div className={"flex flex-row gap-[12px]"}>
					<Button onClick={() => declineInvite()} className={"flex h-fit bg-zinc-800 hover:bg-zinc-600 active:bg-zinc-900"} intent={"other"} type={"circle"} usage={"other"}>
						<RemoveIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
					</Button>
					<Button onClick={() => acceptInvite()} className={"flex h-fit"} intent={"primary"} type={"circle"} usage={"other"}>
						<ConfirmIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
					</Button>
				</div>
			</div>
		</div>
	)
}