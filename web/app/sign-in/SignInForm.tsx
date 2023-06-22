"use client"

import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import GoogleIcon from "@/components/Icons/GoogleIcon";
import GithubIcon from "@/components/Icons/GithubIcon";
import {loginPasswordUser} from "@/lib/users";
import {setCookie} from "cookies-next";
import {useRouter} from "next/navigation";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";
import {useState} from "react";
import RemoveIcon from "@/components/Icons/RemoveIcon";

export function SignInForm() {
	const [error, setError] = useState<string | null>(null);
	const { push } = useRouter();

	async function handleSubmit(event: any) {
		event.preventDefault()
		setError(null)

		let data = {
			email: String(event.currentTarget.Email.value),
			password: String(event.currentTarget.Password.value),
		}

		loginPasswordUser(data.email, data.password)
			.then(async result => {
				let root = result.data.loginPasswordUser;
				if (root.errors) {
					setError(root.errors[0].message)
				} else {
					let token = root.userLoginResult.jwt;
					await setCookie("token", token)
					await push("/app")
				}
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
					<p className={"font-semibold text-sm text-red-500"}>{error}</p>
				</div>
			)}

			<div className={"flex flex-col gap-[16px]"}>
				<Button type={"rounded"} intent={"primary"} usage={"form"} className={"justify-center w-full"}>
					<RightArrowIcon className={"w-[16px] h-[16px]"}/>
					Sign in
				</Button>
			</div>
		</form>
	)
}