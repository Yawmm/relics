"use client";

import AppHeader from "@/components/App/AppHeader";
import ProjectIcon from "@/components/Icons/ProjectIcon";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import React, {useEffect, useRef} from "react";
import Description from "@/components/Text/Description";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import {acceptProjectInvite, declineProjectInvite, GET_PROJECTS_QUERY} from "@/lib/projects";
import {useUser} from "@/lib/hooks";
import Subtitle from "@/components/Text/Subtitle";
import {useQuery} from "@apollo/client";
import {useRouter} from "next/navigation";
import {Project, ProjectInvite} from "@/lib/types";
import ProjectItem from "@/components/App/Projects/ProjectItem";
import LoadScreen from "@/components/Login/LoadScreen";
import CreateProjectDialog from "@/components/App/Dialogs/Projects/CreateProjectDialog";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {ReceivedInviteItem} from "@/components/App/Projects/ProjectInviteItem";
import Header from "@/components/Text/Header";
import {GET_PROJECT_INVITES_QUERY} from "@/lib/users";

export default function Projects() {
	const createDialogRef = useRef<DialogModalHandle>(null);
	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	
	const { push } = useRouter();
	const { user } = useUser();

	const { data: projects, loading: projectsLoading, refetch: refetchProjects } = useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY, {
		variables: {
			userId: user?.id
		},
		skip: user === null
	});

	const { data: projectInvites, loading: projectInvitesLoading, refetch: refetchProjectInvites } = useQuery<{ projectInvites: ProjectInvite[] }>(GET_PROJECT_INVITES_QUERY, {
		variables: {
			id: user?.id
		},
		skip: user === null,
	});

	async function acceptProject(project: ProjectInvite) {
		if (!user || !project)
			return;

		acceptProjectInvite(project.id, user?.id)
			.then(async result => {
				const root = result.data.acceptProjectInvitation;
				if (root.errors) return;

				await refetchProjectInvites();
				await refetchProjects();
			});
	}

	async function declineProject(project: ProjectInvite) {
		if (!user || !project)
			return;

		declineProjectInvite(project.id, user.id)
			.then(async result => {
				const root = result.data.declineProjectInvitation;
				if (root.errors) return;

				await refetchProjectInvites();
			});
	}

	useEffect(() => {
		(async () => {
			if (!user) return;
			await refetchProjects();
			await refetchProjectInvites();
		})();
	}, [user]);

	return (
		<>
			<LoadScreen isShown={projectsLoading || projectInvitesLoading} />
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

				<div className={"flex flex-col gap-[12px]"}>
					<Subtitle className={"px-[var(--gutter-x-margin)]"}>
						Projects
					</Subtitle>

					<div
						className={"flex flex-col gap-[12px] pt-[8px] mt-[-8px] h-full w-full px-[var(--gutter-x-margin)]"}>
						{projects?.projects?.length && projects.projects.length > 0
							? projects?.projects?.map((p: Project) => (
								<ProjectItem
									key={p.id}
									project={p}
									confirmationDialog={confirmationDialogRef}

									className={"w-full h-fit"}

									onClick={() => push(`/app/projects/${p.id}`)}
									onUpdate={refetchProjects}
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

				<div className={"flex flex-col gap-[12px]"}>
					<Subtitle className={"px-[var(--gutter-x-margin)]"}>
						Invites
					</Subtitle>

					<div className={"flex flex-col gap-[12px] h-full px-[var(--gutter-x-margin)]"}>
						{projectInvites?.projectInvites && projectInvites.projectInvites.length > 0
							? projectInvites?.projectInvites?.map((i: ProjectInvite) => (
								<ReceivedInviteItem
									key={i.id}
									onAccept={() => acceptProject(i)}
									onDecline={() => declineProject(i)}

									content={
										<>
											<div>
												<ProjectIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
											</div>
											<div className={"flex flex-col flex-grow text-left"}>
												<Header>
													{i.name}
												</Header>
												<Description>
													{i.description}
												</Description>
											</div>
										</>
									}
								/>
							)) : (
								<Description>
									You haven't received any invites to other projects yet.
								</Description>
							)
						}
					</div>
				</div>
			</div>

			<ConfirmationDialog ref={confirmationDialogRef}/>

			<CreateProjectDialog
				dialog={createDialogRef}
				user={user}
				onUpdate={refetchProjects}
			/>
		</>
	);
}