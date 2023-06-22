"use client"

import AppHeader from "@/components/App/AppHeader";
import UserIcon from "@/components/Icons/UserIcon";
import Subtitle from "@/components/Text/Subtitle";
import {useQuery} from "@apollo/client";
import {User} from "@/lib/types";
import {GET_USER_QUERY} from "@/lib/users";
import InputField from "@/components/Input/InputField";

export default function UserInformation({ params } : any) {
	const { data } = useQuery<{ user: User }>(GET_USER_QUERY, {
		variables: {
			id: params.id
		},
		skip: !params || !params.id
	})

	return (
		<div className={"flex flex-col gap-[36px]"}>
			<AppHeader
				title={"Personal information"}
				description={`Inspect the personal information of the current user.`}
				icon={<UserIcon />}
			/>

			<div className={"flex flex-col gap-[12px] px-[var(--gutter-x-margin)]"}>
				<Subtitle>
					Properties
				</Subtitle>
				<div className={"flex flex-col gap-[12px]"}>
					<InputField disabled value={data?.user.id} title={"Id"} type={"text"} required />
					<InputField disabled value={data?.user.username} title={"Username"} type={"text"} required />
					<InputField disabled value={data?.user.email} title={"Email"} type={"email"} required />
				</div>
			</div>
		</div>
	)
}