"use client";

import AppHeader from "@/components/App/AppHeader";
import UserIcon from "@/components/Icons/UserIcon";
import Subtitle from "@/components/Text/Subtitle";
import InputField from "@/components/Input/InputField";
import {useUserQuery} from "@/hooks/queryHooks";

export default function UserInformation({ params: { id } } : { params: { id: string }}) {
	const { data } = useUserQuery(id);

	return (
		<div className={"flex flex-col w-full h-fit gap-[36px] py-gutter"}>
			<AppHeader
				title={"Personal information"}
				description={`Inspect the personal information of the current user.`}
				icon={<UserIcon />}
			/>

			<div className={"flex flex-col gap-[12px] px-gutter"}>
				<h3>
					Properties
				</h3>
				<div className={"flex flex-col gap-[12px]"}>
					<InputField disabled value={data?.user.id} title={"Id"} type={"text"} required />
					<InputField disabled value={data?.user.username} title={"Username"} type={"text"} required />
					<InputField disabled value={data?.user.email} title={"Email"} type={"email"} required />
				</div>
			</div>
		</div>
	);
}