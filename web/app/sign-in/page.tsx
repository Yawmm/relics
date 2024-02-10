import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import Link from "next/link";
import {SignInForm} from "@/app/sign-in/SignInForm";

export default function SignIn() {
	return (
		<div className={"flex flex-col w-full h-full gap-[24px] px-[var(--gutter-x-margin)]"}>
			<div className={"flex flex-col gap-[12px]"}>
				<Title>
					Sign in
				</Title>
				<Description>
					Fill in the same information you used to create your account below.
				</Description>
			</div>

			<div className={"flex flex-col gap-[36px]"}>
				<SignInForm />

				<div className={"flex flex-row gap-[4px]"}>
					<p className={"text-zinc-200 text-sm"}>
						Need to create a new account?
					</p>
					<Link href={"/sign-up"} className={"text-zinc-200 text-sm underline font-bold"}>Sign up</Link>
				</div>
			</div>
		</div>
	);
}