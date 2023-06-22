"use client"

import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import GoogleIcon from "@/components/Icons/GoogleIcon";
import GithubIcon from "@/components/Icons/GithubIcon";
import {loginPasswordUser, registerUser} from "@/lib/users";
import {setCookie} from "cookies-next";
import {useRouter} from "next/navigation";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import {useState} from "react";

export function SignUpForm() {
	const [error, setError] = useState<string | null>(null);
	const { push } = useRouter();

	async function handleSubmit(event: any) {
		event.preventDefault()

		let data = {
			username: String(event.currentTarget.Username.value),
			email: String(event.currentTarget.Email.value),
			password: String(event.currentTarget.Password.value),
		}

		registerUser(data.username, data.email, data.password)
			.then(async result => {
				let root = result.data.registerPasswordUser;
				if (root.errors) {
					setError(root.errors[0].message)
				} else {
					await loginUser(data.email, data.password);
				}
			});
	}

	async function loginUser(email: string, password: string) {
		loginPasswordUser(email, password)
			.then(async result => {
				let root = result.data.loginPasswordUser;
				if (root.errors) {
					setError(root.errors[0].message)
				} else {
					let token = root.userLoginResult.jwt;
					await setCookie("token", token)
					await push("/app")
				}
			})
	}

	return (
		<form onSubmit={event => handleSubmit(event)} className={"flex flex-col gap-[36px]"}>
			<div className={"flex flex-col gap-[12px]"}>
				<InputField title={"Username"} placeholder={"Example username"} type={"text"} required />
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
					<AddIcon className={"w-[16px] h-[16px]"}/>
					Create account
				</Button>
			</div>
		</form>
	)
}