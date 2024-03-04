"use client";

import AppHeader from "@/components/App/AppHeader";
import ProjectIcon from "@/components/Icons/ProjectIcon";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import React, {useEffect, useRef, useState} from "react";
import Description from "@/components/Text/Description";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import {acceptProjectInvite, declineProjectInvite} from "@/lib/projects";
import {useUser} from "@/lib/hooks";
import Subtitle from "@/components/Text/Subtitle";
import {useRouter} from "next/navigation";
import {Project, ProjectInvite} from "@/lib/types";
import ProjectItem from "@/components/App/Projects/ProjectItem";
import LoadScreen from "@/components/Login/LoadScreen";
import CreateProjectDialog from "@/components/App/Dialogs/Projects/CreateProjectDialog";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {ReceivedInviteItem} from "@/components/App/Projects/InviteItem";
import Header from "@/components/Text/Header";
import {
	updateNotificationEvent,
	useProjectInvitesSubscription,
	useProjectsSubscription
} from "@/hooks/subscriptionHooks";
import {useProjectInvitesQuery, useProjectsQuery} from "@/hooks/queryHooks";

export default function Projects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [projectInvites, setProjectInvites] = useState<ProjectInvite[]>([]);

	const createDialogRef = useRef<DialogModalHandle>(null);
	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	
	const { push } = useRouter();
	const { user } = useUser();

	const { data: userProjects } = useProjectsSubscription(user);
	const { data: userProjectInvites } = useProjectInvitesSubscription(user);

	const { data: getProjects, loading: projectsLoading } = useProjectsQuery(user);
	const { data: getProjectInvites, loading: projectInvitesLoading } = useProjectInvitesQuery(user);

	async function acceptProject(project: ProjectInvite) {
		if (!user || !project)
			return;

		await acceptProjectInvite(project.id, user?.id);
	}

	async function declineProject(project: ProjectInvite) {
		if (!user || !project)
			return;

		await declineProjectInvite(project.id, user.id);
	}

	useEffect(() => updateNotificationEvent(
		userProjects?.userProjects.type,
		userProjects?.userProjects.project,
		setProjects
	), [userProjects]);

	useEffect(() => updateNotificationEvent(
		userProjectInvites?.userProjectInvites.type,
		userProjectInvites?.userProjectInvites.projectInvite,
		setProjectInvites
	), [userProjectInvites]);

	useEffect(() => {
		const data = getProjects?.projects;
		if (!data) return;

		setProjects(data);
	}, [getProjects]);

	useEffect(() => {
		const data = getProjectInvites?.projectInvites;
		if (!data) return;

		setProjectInvites(data);
	}, [getProjectInvites]);

	return (
		<>
			<LoadScreen isShown={projectsLoading || projectInvitesLoading} />
			<div className={"flex flex-col flex-grow w-full h-fit md:h-full gap-[36px] py-gutter"}>
				<div className={"flex flex-col gap-[12px] md:gap-[24px]"}>
					<AppHeader
						title={"Projects"}
						description={`Create projects to manage your plans with tasks that describe individual operation that need to be done.`}
						icon={<ProjectIcon/>}
					/>

					<div className={"flex flex-row px-gutter"}>
						<Button onClick={() => createDialogRef.current?.show()} type={"rounded"} usage={"form"}
								intent={"primary"}>
							<AddIcon className={"small-icon"}/>
							Create project
						</Button>
					</div>
				</div>

				<div className={"flex flex-col gap-[12px]"}>
					<h3 className={"px-gutter"}>
						Projects
					</h3>

					<div
						className={"flex flex-col gap-[12px] pt-[8px] mt-[-8px] h-full w-full px-gutter"}>
						{projects.length > 0
							? projects.map((p: Project) => (
								<ProjectItem
									key={p.id}
									project={p}
									confirmationDialog={confirmationDialogRef}

									className={"w-full h-fit"}

									onClick={() => push(`/app/projects/${p.id}`)}
								/>
							))
							: (
								<p>
									You haven't created any projects yet.
								</p>
							)
						}
					</div>
				</div>

				<div className={"flex flex-col gap-[12px]"}>
					<h3 className={"px-gutter"}>
						Invites
					</h3>

					<div className={"flex flex-col gap-[12px] h-full px-gutter"}>
						{projectInvites.length > 0
							? projectInvites.map((i: ProjectInvite) => (
								<ReceivedInviteItem
									key={i.id}
									onAccept={() => acceptProject(i)}
									onDecline={() => declineProject(i)}

									content={
										<>
											<div>
												<ProjectIcon className={"icon text-zinc-200"}/>
											</div>
											<div className={"flex flex-col flex-grow text-left"}>
												<h4>
													{i.name}
												</h4>
												<p>
													{i.description}
												</p>
											</div>
										</>
									}
								/>
							)) : (
								<p>
									You haven't received any invites to other projects yet.
								</p>
							)
						}
					</div>
				</div>
			</div>

			<ConfirmationDialog ref={confirmationDialogRef}/>

			<CreateProjectDialog
				dialog={createDialogRef}
				user={user}
			/>
		</>
	);
}