"use client"

import AppHeader from "@/components/App/AppHeader";
import ProjectIcon from "@/components/Icons/ProjectIcon";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import React, {useEffect, useRef, useState} from "react";
import InputField from "@/components/Input/InputField";
import Description from "@/components/Text/Description";
import Title from "@/components/Text/Title";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import {addProject, GET_PROJECTS_QUERY} from "@/lib/projects";
import {useUser} from "@/lib/hooks";
import Subtitle from "@/components/Text/Subtitle";
import {useQuery} from "@apollo/client";
import {usePathname, useRouter} from "next/navigation";
import {Project} from "@/lib/types";
import ProjectItem from "@/components/App/Projects/ProjectItem";
import LoadScreen from "@/components/Login/LoadScreen";
import CreateProjectDialog from "@/components/App/Dialogs/CreateProjectDialog";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";

export default function Projects() {
	const createDialogRef = useRef<DialogModalHandle>(null);
	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	
	const { push } = useRouter();
	const { user } = useUser();

	const { data, loading, refetch } = useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY, {
		variables: {
			userId: user?.id
		},
		skip: user === null
	})

	useEffect(() => {
		(async () => {
			if (!user)
				return;

			await refetch()
		})()
	}, [user])

	return (
		<>
			<LoadScreen isShown={loading} />
			<div className={"flex flex-col gap-[36px]"}>
				<div className={"flex flex-col gap-[12px]"}>
					<AppHeader
						title={"Projects"}
						description={`Create projects to manage your plans with tasks that describe individual operation that need to be done.`}
						icon={<ProjectIcon/>}
					/>

					<div className={"flex flex-row px-[var(--gutter-x-margin)]"}>
						<Button onClick={() => createDialogRef.current?.show()} type={"rounded"} usage={"form"}
								intent={"primary"}>
							<AddIcon className={"w-[16px] h-[16px]"}/>
							Create project
						</Button>
					</div>
				</div>

				<div className={"flex flex-col h-full gap-[12px]"}>
					<Subtitle className={"px-[var(--gutter-x-margin)]"}>
						Projects
					</Subtitle>

					<div className={"flex flex-col gap-[12px] pt-[8px] mt-[-8px] h-full w-full overflow-x-auto px-[var(--gutter-x-margin)]"}>
						{data?.projects?.length && data.projects.length > 0
							? data?.projects?.map((p: Project) => (
								<ProjectItem
									key={p.id}
									project={p}
									confirmationDialog={confirmationDialogRef}
									onClick={async () => await push(`/app/projects/${p.id}`)}
									onChange={async () => await refetch()}
									className={"w-full h-fit"}
								/>
							))
							: (
								<Description>
									You haven't created any projects yet.
								</Description>
							)
						}
					</div>
				</div>
				
				<ConfirmationDialog ref={confirmationDialogRef} />
				
				<CreateProjectDialog
					dialog={createDialogRef}
					user={user}
					onUpdate={async () => await refetch()}
				/>
			</div>
		</>
	)
}