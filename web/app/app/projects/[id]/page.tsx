"use client";

import {removeProject} from "@/lib/projects";
import AppHeader from "@/components/App/AppHeader";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import {Category, Project, Task} from "@/lib/types";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Description from "@/components/Text/Description";
import Subtitle from "@/components/Text/Subtitle";
import CategoryItem from "@/components/App/Projects/CategoryItem";
import {useUser} from "@/lib/hooks";
import CreateTaskDialog from "@/components/App/Dialogs/Tasks/CreateTaskDialog";
import CategoryDialog from "@/components/App/Dialogs/Projects/Categories/CreateCategoryDialog";
import LoadScreen from "@/components/Login/LoadScreen";
import EditIcon from "@/components/Icons/EditIcon";
import MemberDialog from "@/components/App/Dialogs/Members/MemberDialog";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import {useRouter} from "next/navigation";
import ItemDialog from "@/components/App/Dialogs/ItemDialog";
import EditProjectDialog from "@/components/App/Dialogs/Projects/EditProjectDialog";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import TaskItem from "@/components/App/Projects/TaskItem";
import UserIcon from "@/components/Icons/UserIcon";
import TeamDialog from "@/components/App/Dialogs/Teams/TeamDialog";
import TeamIcon from "@/components/Icons/TeamIcon";
import {useProjectQuery} from "@/hooks/queryHooks";
import {useProjectSubscription} from "@/hooks/subscriptionHooks";

export default function Project({ params: { id } }: { params: { id: string }}) {
	const [project, setProject] = useState<Project | null>(null);
	const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

	const itemDialogRef = useRef<DialogModalHandle>(null);
	const categoryDialogRef = useRef<DialogModalHandle>(null);
	const taskDialogRef = useRef<DialogModalHandle>(null);
	const memberDialogRef = useRef<DialogModalHandle>(null);
	const teamDialogRef = useRef<DialogModalHandle>(null);

	const editProjectDialogRef = useRef<DialogModalHandle>(null);
	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);

	const { user } = useUser();
	const { push } = useRouter();

	const { data: getProject, loading, refetch } = useProjectQuery(id);
	const { data: listenProject } = useProjectSubscription(project);

	const isOwner = useCallback(() => project?.owner.userId == user?.id, [project, user]);

	const items = [
		{
			name: "Category",
			onSelect: () => categoryDialogRef.current?.show()
		},
		{
			name: "Task",
			onSelect: () => taskDialogRef.current?.show()
		}
	];
	
	function createTask(category: Category) {
		setCurrentCategory(category);
		taskDialogRef.current?.show();
	}
	
	async function deleteProject() {
		if (!project) return;
		confirmationDialogRef.current?.show(
			"Remove project",
			"Are you sure you want to remove the given project indefinitely?",
			async () => {
				await removeProject(project.id);
				push("/app/projects");
			}
		);
	}

	useEffect(() => {
		const project = listenProject?.project.project;
		const type = listenProject?.project.type;
		if (!project || type === undefined) return;

		switch (type) {
			case "UPDATED":
				setProject(project);
				break;
			case "REMOVED":
				push("/app/projects", {
					forceOptimisticNavigation: true
				});
				break;
		}
	}, [listenProject]);

	useEffect(() => {
		const data = getProject?.project;
		if (!data) return;

		setProject(data);
	}, [getProject]);

	useEffect(() => {
		(async () => {
			if (!user) return;
			await refetch();
		})();
	}, [user]);

	return (
		<>
			<LoadScreen isShown={loading} />

			<div className={"flex flex-col min-h-full gap-[36px]"}>
				<div className={"flex flex-col gap-[12px]"}>
					<AppHeader
						title={project?.name}
						description={project?.description}
					/>

					<div className={"flex flex-row gap-[12px] px-[var(--gutter-x-margin)]"}>
						<Button onClick={() => itemDialogRef.current?.show()} type={"rounded"} usage={"form"} intent={"primary"}>
							<AddIcon className={"w-[16px] h-[16px]"}/>
							Create item
						</Button>

						<Button onClick={() => memberDialogRef.current?.show()} type={"circle"} usage={"form"} intent={"secondary"}>
							<UserIcon className={"w-[16px] h-[16px]"}/>
						</Button>

						<Button onClick={() => teamDialogRef.current?.show()} type={"circle"} usage={"form"} intent={"secondary"}>
							<TeamIcon className={"w-[16px] h-[16px]"}/>
						</Button>

						{isOwner() && (
							<Button onClick={deleteProject} type={"circle"} usage={"form"} intent={"secondary"}>
								<DeleteIcon className={"w-[16px] h-[16px]"}/>
							</Button>						
						)}

						<Button onClick={() => editProjectDialogRef.current?.show()} type={"circle"} usage={"form"} intent={"secondary"}>
							<EditIcon className={"w-[16px] h-[16px]"}/>
						</Button>
					</div>
				</div>

				<div className={"flex flex-col flex-grow gap-[36px]"}>
					<div className={"flex flex-col gap-[12px]"}>
						<Subtitle className={"px-[var(--gutter-x-margin)]"}>
							Categories
						</Subtitle>

						<div className={"flex flex-row w-screen"}>
							{project?.categories?.length && project?.categories.length > 0
								? (
									<div className={"flex flex-row w-screen overflow-x-auto snap-always snap-x gap-[12px] px-[var(--gutter-x-margin)] pb-[24px]"}>
										{project?.categories?.map((c: Category) =>
											<CategoryItem
												key={c.id}
												category={c}
												project={project}
												confirmationDialog={confirmationDialogRef}

												onAdd={createTask}
											/>
										)}
									</div>
								)
								: (
									<div className={"px-[var(--gutter-x-margin)]"}>
										<Description>
											You haven't created any categories yet.
										</Description>
									</div>
								)
							}
						</div>
					</div>

					<div className={"flex flex-col flex-grow gap-[12px]"}>
						<Subtitle className={"px-[var(--gutter-x-margin)]"}>
							Tasks
						</Subtitle>

						<div className={"flex flex-col gap-[12px] h-full px-[var(--gutter-x-margin)]"}>
							{project?.tasks?.length && project.tasks.length > 0
								? project?.tasks?.map((t: Task) => (
									<TaskItem
										key={t.id}
										task={t}
										project={project}

										confirmationDialog={confirmationDialogRef}
										className={"w-full h-fit"}
									/>
								)) : (
									<Description>
										You haven't created any separate tasks yet.
									</Description>
								)
							}
						</div>
					</div>
				</div>
			</div>

			<ConfirmationDialog ref={confirmationDialogRef} />

			<MemberDialog
				dialog={memberDialogRef}
				project={project}
			/>

			<TeamDialog
				dialog={teamDialogRef}
				user={user}
				project={project}
			/>

			<ItemDialog
				dialog={itemDialogRef}
				items={items}
			/>

			<CategoryDialog
				dialog={categoryDialogRef}
				project={project}
			/>

			<CreateTaskDialog
				dialog={taskDialogRef}
				user={user}
				project={project}
				category={currentCategory}
			/>

			<EditProjectDialog
				dialog={editProjectDialogRef}
				project={project}
			/>
		</>
	);
}