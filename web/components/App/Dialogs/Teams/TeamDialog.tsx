import {Project, Team, User} from "@/lib/types";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import React, {RefObject, useCallback, useRef} from "react";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import {linkTeam} from "@/lib/projects";
import {useQuery} from "@apollo/client";
import {GET_TEAMS_QUERY} from "@/lib/teams";
import TeamItem from "@/components/App/Teams/TeamItem";
import LinkItem from "@/components/App/Teams/LinkItem";

type TeamDialogProps = {
	dialog: RefObject<DialogModalHandle>
	user: User | null
	project: Project | null,
}

export default function TeamDialog({ dialog, user, project } : TeamDialogProps) {
	const linkTeamDialogRef = useRef<DialogModalHandle>(null);

	const { data } = useQuery<{ teams: Team[] }>(GET_TEAMS_QUERY, {
		variables: {
			id: user?.id
		},
		skip: user === null
	});

	const teams = useCallback(() => data?.teams?.filter((t: Team) => !project?.links.find(l => l.id == t.id)), [project, data?.teams]);

	const isOwner = useCallback(() => project?.owner.userId == user?.id, [project, user]);
	const hasTeams = useCallback(() => {
		const value = teams();
		return value && value.length > 0;
	}, [teams]);

	async function link(team: Team) {
		if (!team || !project)
			return;

		await linkTeam(team.id, project?.id);

		linkTeamDialogRef.current?.hide();
	}

	return (
		<>
			<Dialog.Modal ref={dialog}>
				<Dialog.Container>
					<Dialog.Column>
						<h2>
							Teams
						</h2>

						<p>
							Adjust the teams linked to the project, adding or removing them.
						</p>
					</Dialog.Column>

					<Dialog.Column>
						{project?.links && project.links.length > 0 && (
							project?.links?.map(link => (
								<LinkItem
									link={link}
									project={project}
									isOwner={isOwner()}
								/>
							)))
						}

						{(hasTeams() && isOwner()) && (
							<Button onClick={() => linkTeamDialogRef.current?.show()} type={"square"} usage={"form"} intent={"primary"} className={"flex flex-grow justify-center"}>
								<AddIcon className={"small-icon"}/>
							</Button>
						)}
					</Dialog.Column>
					
					<Dialog.Row>
						<Button focus onClick={() => dialog.current?.hide()} type={"rounded"} usage={"form"} intent={"secondary"} className={"flex flex-grow justify-center"}>
							<RemoveIcon className={"small-icon"}/>
							Close
						</Button>
					</Dialog.Row>
				</Dialog.Container>
			</Dialog.Modal>

			<Dialog.Modal ref={linkTeamDialogRef}>
				<Dialog.Container>
					<Dialog.Column>
						<h2>
							Link team
						</h2>

						<p>
							Link one of your teams to the current project.
						</p>
					</Dialog.Column>

					<Dialog.Column>
						{hasTeams()
							? teams()!.map((team: Team) =>  (
								<TeamItem
									team={team}
									editable={false}
									onClick={async () => await link(team)}
								/>
							)) : (
								<p>
									There aren't any teams that you haven't linked to the project.
								</p>
							)
						}
					</Dialog.Column>

					<Dialog.Row>
						<Button focus onClick={() => linkTeamDialogRef.current?.hide()} type={"rounded"} usage={"form"} intent={"secondary"} className={"flex flex-grow justify-center"}>
							<RemoveIcon className={"small-icon"}/>
							Close
						</Button>
					</Dialog.Row>
				</Dialog.Container>
			</Dialog.Modal>
		</>
	);
}

