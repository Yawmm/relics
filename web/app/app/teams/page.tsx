"use client";

import LoadScreen from "@/components/Login/LoadScreen";
import AppHeader from "@/components/App/AppHeader";
import React, {useRef} from "react";
import TeamIcon from "@/components/Icons/TeamIcon";
import {useQuery} from "@apollo/client";
import {GET_TEAM_INVITES_QUERY} from "@/lib/users";
import {useUser} from "@/lib/hooks";
import {Team, TeamInvite} from "@/lib/types";
import {ReceivedInviteItem} from "@/components/App/Projects/ProjectInviteItem";
import Subtitle from "@/components/Text/Subtitle";
import Description from "@/components/Text/Description";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import CreateTeamDialog from "@/components/App/Dialogs/Teams/CreateTeamDialog";
import {acceptTeamInvite, declineTeamInvite, GET_TEAMS_QUERY} from "@/lib/teams";
import TeamItem from "@/components/App/Teams/TeamItem";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import Header from "@/components/Text/Header";

export default function Teams() {
	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	const createDialogRef = useRef<DialogModalHandle>(null);

	const { user } = useUser();
	const { data: teams, loading: teamsLoading, refetch: refetchTeams } = useQuery<{ teams: Team[] }>(GET_TEAMS_QUERY, {
		variables: {
			id: user?.id
		},
		skip: user === null
	});

	const { data: teamInvites, loading: teamInvitesLoading, refetch: refetchTeamInvites } = useQuery<{ teamInvites: TeamInvite[] }>(GET_TEAM_INVITES_QUERY, {
		variables: {
			id: user?.id
		},
		skip: user === null,
	});

	async function acceptTeam(team: TeamInvite) {
		if (!user || !team)
			return;

		acceptTeamInvite(team.id, user?.id)
			.then(async result => {
				const root = result.data.acceptTeamInvitation;
				if (root.errors) return;

				await refetchTeamInvites();
				await refetchTeams();
			});
	}

	async function declineTeam(team: TeamInvite) {
		if (!user || !team)
			return;

		declineTeamInvite(team.id, user.id)
			.then(async result => {
				const root = result.data.declineProjectInvitation;
				if (root.errors) return;

				await refetchTeamInvites();
				await refetchTeams();
			});
	}

	return (
		<>
			<LoadScreen isShown={teamsLoading || teamInvitesLoading} />
			<div className={"flex flex-col gap-[36px]"}>
				<div className={"flex flex-col gap-[12px]"}>
					<AppHeader
						title={"Teams"}
						description={`Manage the invites you have to other projects and teams.`}
						icon={<TeamIcon/>}
					/>

					<div className={"flex flex-row px-[var(--gutter-x-margin)]"}>
						<Button onClick={() => createDialogRef.current?.show()} type={"rounded"} usage={"form"}
								intent={"primary"}>
							<AddIcon className={"w-[16px] h-[16px]"}/>
							Create team
						</Button>
					</div>
				</div>

				<div className={"flex flex-col gap-[12px]"}>
					<Subtitle className={"px-[var(--gutter-x-margin)]"}>
						Teams
					</Subtitle>

					<div className={"flex flex-col gap-[12px] h-full px-[var(--gutter-x-margin)]"}>
						{teams?.teams && teams.teams.length > 0
							? teams?.teams?.map((team: Team) => (
								<TeamItem
									team={team}
									onUpdate={async () => await refetchTeams()}
								/>
							)) : (
								<Description>
									You aren't in any teams yet.
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
						{teamInvites?.teamInvites && teamInvites?.teamInvites?.length > 0
							? teamInvites?.teamInvites?.map((i: TeamInvite) => (
								<ReceivedInviteItem
									key={i.id}
									onAccept={() => acceptTeam(i)}
									onDecline={() => declineTeam(i)}

									content={
										<>
											<div>
												<TeamIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
											</div>
											<div className={"flex flex-col flex-grow text-left"}>
												<Header>
													{i.name}
												</Header>
											</div>
										</>
									}
								/>
							)) : (
								<Description>
									You haven't received any invites to other teams yet.
								</Description>
							)
						}
					</div>
				</div>
			</div>

			<ConfirmationDialog ref={confirmationDialogRef}/>

			<CreateTeamDialog
				dialog={createDialogRef}
				user={user}

				onUpdate={refetchTeams}
			/>
		</>
	);
}