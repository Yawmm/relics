"use client"

import LoadScreen from "@/components/Login/LoadScreen";
import AppHeader from "@/components/App/AppHeader";
import React from "react";
import TeamIcon from "@/components/Icons/TeamIcon";
import {useQuery} from "@apollo/client";
import {GET_INVITES_QUERY} from "@/lib/users";
import {useUser} from "@/lib/hooks";
import {Project} from "@/lib/types";
import {ReceivedInviteItem} from "@/components/App/Projects/InviteItem";
import Subtitle from "@/components/Text/Subtitle";
import Description from "@/components/Text/Description";

export default function Teams() {
	const { user } = useUser();
	const { data, loading, refetch } = useQuery(GET_INVITES_QUERY, {
		variables: {
			id: user?.id
		},
		skip: user === null,
	})

	return (
		<>
			<LoadScreen isShown={false} />
			<div className={"flex flex-col gap-[36px]"}>
				<div className={"flex flex-col gap-[12px]"}>
					<AppHeader
						title={"Teams"}
						description={`Manage the invites you have to other projects and teams.`}
						icon={<TeamIcon/>}
					/>
				</div>

				<div className={"flex flex-col h-full gap-[12px]"}>
					<Subtitle className={"px-[var(--gutter-x-margin)]"}>
						Incoming invites
					</Subtitle>

					<div className={"flex flex-col gap-[12px] h-full px-[var(--gutter-x-margin)]"}>
						{data?.invites?.length > 0
							? data?.invites?.map((i: Project) => (
								<ReceivedInviteItem
									key={i.id}
									project={i}

									onUpdate={async () => await refetch()}
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
		</>
	)
}