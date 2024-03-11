import Link from "next/link";
import {SignUpForm} from "@/components/Home/Forms/SignUpForm";

export default function SignUp() {
	return (
		<div className={"flex flex-row w-full h-full"}>
			<div className={"flex flex-col min-w-[40%] h-full gap-[24px] px-gutter pb-gutter pt-[calc(theme(margin.gutter-y)/2)] md:pt-gutter"}>
				<div className={"flex flex-col gap-[12px]"}>
					<h1>
						Sign up
					</h1>
					<p>
						Fill in the required information below to create your account and to start enjoying the features of the application.
					</p>
				</div>

				<div className={"flex flex-col gap-[36px]"}>
					<SignUpForm/>

					<div className={"flex flex-row gap-[4px]"}>
						<p>
							Already have an account?
						</p>
						<Link href={"/sign-in"}>
							<p className={"text-zinc-200 underline font-bold"}>
								Sign in
							</p>
						</Link>
					</div>
				</div>
			</div>
			<div className={"hidden lg:flex flex-col flex-grow max-w-[70%] w-full h-full xl:gap-[24px] bg-zinc-600 overflow-clip"}>
				<div className={"flex flex-col gap-[24px] h-full transform rotate-45"}>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
					</div>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
					<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
					</div>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
					</div>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
					</div>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
					<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
					</div>
				</div>
			</div>
		</div>
	);
}