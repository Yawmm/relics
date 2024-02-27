import React, {RefObject, useRef, useState} from "react";
import {Project} from "@/lib/types";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Button from "@/components/Input/Button";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ChoiceDialog from "@/components/App/Dialogs/ChoiceDialog";
import {useQuery} from "@apollo/client";
import {GET_PROJECTS_QUERY} from "@/lib/projects";
import CreateTaskDialog from "@/components/App/Dialogs/Tasks/CreateTaskDialog";
import {useUser} from "@/lib/hooks";

type TaskDialogProps = {
	dialog: RefObject<DialogModalHandle>
}

export default function CreateStandaloneTaskDialog({ dialog } : TaskDialogProps) {
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	const chooseProjectDialogRef = useRef<DialogModalHandle>(null);
	const createTaskDialogRef = useRef<DialogModalHandle>(null);

	const { user } = useUser();

	const { data: projects} = useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY, {
		variables: {
			userId: user?.id
		},
		skip: !user,
	});

	return (
		<>
			<Dialog.Modal ref={dialog}>
				<Dialog.Container>
					<Dialog.Column>
						<h2>
							Create task
						</h2>

						<p>
							Create a new task, with a required project to which the task is linked.
						</p>
					</Dialog.Column>

					<Dialog.Column>
						<Button
							onClick={() => chooseProjectDialogRef.current?.show()}
							className={"justify-between"}
							type={"square"}
							usage={"form"}
							intent={"primary"}
						>
							{selectedProject?.name ?? "Project"}
							<RightArrowIcon className={"small-icon"}/>
						</Button>
						<Button
							focus
							disabled={selectedProject === null}
							onClick={() => createTaskDialogRef.current?.show()}
							className={"justify-between"}
							type={"square"}
							usage={"form"}
							intent={"primary"}
						>
							Task
							<RightArrowIcon className={"small-icon"}/>
						</Button>
					</Dialog.Column>

					<Dialog.Row>
						<Button
							onClick={() => dialog.current?.hide()}
							className={"flex flex-grow justify-center"}
							type={"rounded"}
							usage={"form"}
							intent={"secondary"}
						>
							<RemoveIcon className={"small-icon"}/>
							Cancel
						</Button>
					</Dialog.Row>
				</Dialog.Container>
			</Dialog.Modal>

			<ChoiceDialog
				dialog={chooseProjectDialogRef}

				options={projects?.projects?.map(p => ({ id: p.id, name: p.name })) ?? []}

				onSelectOption={id => setSelectedProject(projects?.projects?.find(p => p.id == id) ?? null)}
				onResetOption={() => setSelectedProject(null)}
			/>

			<CreateTaskDialog
				dialog={createTaskDialogRef}

				user={user}
				project={selectedProject}
			/>
		</>
	);
}