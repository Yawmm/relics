import {JSX} from "react";

type AppHeaderProps = {
	title: string | undefined,
	description: string | undefined
	icon?: JSX.Element
}

export default function AppHeader({ title, description, icon } : AppHeaderProps) {
	return (
		<div className={"flex flex-col gap-[12px] px-gutter"}>
			<div className={"flex flex-row items-center gap-[12px]"}>
				{icon && (
					<div className={"w-[36px] h-[36px] lg:w-[48px] lg:h-[48px] text-zinc-200"}>
						{icon}
					</div>
				)}

				<h1>
					{title}
				</h1>
			</div>
			<p>
				{description}
			</p>
		</div>
	);
}