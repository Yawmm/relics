import Link from "next/link";
import {SignInForm} from "@/components/Home/Forms/SignInForm";

export default function SignIn() {
	return (
		<div className={"flex flex-row w-full"}>
			<div className={"flex flex-col h-full gap-[24px] px-gutter pb-gutter pt-[calc(theme(margin.gutter-y)/2)] md:pt-gutter"}>
				<div className={"flex flex-col gap-[12px]"}>
					<h1>
						Sign in
					</h1>
					<p>
						Fill in the same information you used to create your account below to sign in and to continue
						enjoying the features of the application.
					</p>
				</div>

				<div className={"flex flex-col gap-[36px]"}>
					<SignInForm/>

					<div className={"flex flex-row gap-[4px]"}>
						<p>
							Need to create a new account?
						</p>
						<Link href={"/sign-up"}>
							<p className={"text-zinc-200 underline font-bold"}>
								Sign up
							</p>
						</Link>
					</div>
				</div>
			</div>
			<div className={"hidden lg:flex flex-col flex-grow max-w-[70%] w-full h-full xl:gap-[24px] bg-zinc-600 overflow-hidden"}>
				<div className={"flex flex-col gap-[24px] h-full transform rotate-45"}>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
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
					</div>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
					</div>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
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
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
					</div>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
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
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
					</div>
					<div className={"flex flex-row gap-[12px] px-gutter"}>
						<div className={"min-w-[200px] h-[250px] rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
						<div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
					</div>
				</div>
			</div>
		</div>
	);
}