"use client";

import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import {loginPasswordUser} from "@/lib/users";
import {setCookie} from "cookies-next";
import {useRouter} from "next/navigation";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";
import {FormEvent, useState} from "react";
import RemoveIcon from "@/components/Icons/RemoveIcon";

export function SignInForm() {
	const [error, setError] = useState<string | null>(null);
	const { push } = useRouter();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		const data = {
			email: String(event.currentTarget.Email.value),
			password: String(event.currentTarget.Password.value),
		};

		loginPasswordUser(data.email, data.password)
			.then(async result => {
				const root = result.data.loginPasswordUser;
				if (root.errors) {
					setError(root.errors[0].message);
					return;
				}

				const token = root.userLoginResult.jwt;
				setCookie("token", token);
				push("/app");
			});
	}

	return (
		<form onSubmit={event => handleSubmit(event)} className={"flex flex-col gap-[36px]"}>
			<div className={"flex flex-col gap-[12px]"}>
				<InputField title={"Email"} placeholder={"example@gmail.com"} type={"email"} required />
				<InputField title={"Password"} placeholder={"DontUseThis123!"} type={"password"} required />
			</div>

			{error && (
				<div className={"flex flex-row items-center gap-[12px] p-[12px] border-red-500 border-2 rounded-xl"}>
					<RemoveIcon className={"text-red-500 w-[36px] h-[36px]"} />
					<p className={"text-red-500"}>{error}</p>
				</div>
			)}

			<div className={"flex flex-col gap-[16px]"}>
				<Button type={"rounded"} intent={"primary"} usage={"form"} className={"justify-center w-full"}>
					<RightArrowIcon className={"small-icon"}/>
					Sign in
				</Button>
			</div>
		</form>
	);
}