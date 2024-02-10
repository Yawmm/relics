"use client";

import {useQuery} from "@apollo/client";
import {GET_PROJECT_QUERY, removeProject} from "@/lib/projects";
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

export default function Project({ params: { id } }: { params: { id: string }}) {
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

	const { data, loading, refetch } = useQuery<{ project: Project }>(GET_PROJECT_QUERY, {
		variables: {
			id: id
		},
		skip: id === null
	});

	const isOwner = useCallback(() => data?.project.owner.userId == user?.id, [data, user]);

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
		if (!data) return;
		confirmationDialogRef.current?.show(
			"Remove project",
			"Are you sure you want to remove the given project indefinitely?",
			async () => {
				await removeProject(data?.project.id);
				push("/app/projects");
			}
		);
	}

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
						title={data?.project.name}
						description={data?.project.description}
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
							<Button onClick={async () => await deleteProject()} type={"circle"} usage={"form"} intent={"secondary"}>
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
							{data?.project.categories?.length && data?.project.categories.length > 0
								? (
									<div className={"flex flex-row w-screen overflow-x-auto snap-always snap-x gap-[12px] px-[var(--gutter-x-margin)] pb-[24px]"}>
										{data?.project.categories?.map((c: Category) =>
											<CategoryItem
												key={c.id}
												category={c}
												confirmationDialog={confirmationDialogRef}

												onUpdate={async () => await refetch()}
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
							{data?.project.tasks?.length && data.project.tasks.length > 0
								? data?.project.tasks?.map((t: Task) => (
									<TaskItem
										key={t.id}
										task={t}
										confirmationDialog={confirmationDialogRef}
										className={"w-full h-fit"}
										onUpdate={refetch}
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
				project={data?.project}

				onUpdate={refetch}
			/>

			<TeamDialog
				dialog={teamDialogRef}
				user={user}
				project={data?.project}
				confirmationDialog={confirmationDialogRef}

				onUpdate={refetch}
			/>

			<ItemDialog
				dialog={itemDialogRef}
				items={items}
			/>

			<CategoryDialog
				dialog={categoryDialogRef}
				project={data?.project}

				onUpdate={refetch}
			/>

			<CreateTaskDialog
				dialog={taskDialogRef}
				user={user}
				project={data?.project}
				category={currentCategory}

				onUpdate={refetch}
			/>

			<EditProjectDialog
				dialog={editProjectDialogRef}
				project={data?.project}

				onUpdate={refetch}
			/>
		</>
	);
}