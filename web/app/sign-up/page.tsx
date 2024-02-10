import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import Link from "next/link";
import {SignUpForm} from "@/app/sign-up/SignUpForm";

export default function SignUp() {
	return (
		<div className={"flex flex-col w-full h-full gap-[24px] px-[var(--gutter-x-margin)]"}>
			<div className={"flex flex-col gap-[12px]"}>
				<Title>
					Create an account
				</Title>
				<Description>
					Fill the required information in below to create your account.
				</Description>
			</div>

			<div className={"flex flex-col gap-[36px]"}>
				<SignUpForm />

				<div className={"flex flex-row gap-[4px]"}>
					<p className={"text-zinc-200 text-sm"}>
						Already have an account?
					</p>
					<Link href={"/sign-in"} className={"text-zinc-200 text-sm underline font-bold"}>Sign in</Link>
				</div>
			</div>
		</div>
	);
}