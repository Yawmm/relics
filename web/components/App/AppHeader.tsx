import {JSX} from "react";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";

type AppHeaderProps = {
	title: string | undefined,
	description: string | undefined
	icon?: JSX.Element
}

export default function AppHeader({ title, description, icon } : AppHeaderProps) {
	return (
		<div className={"flex flex-col gap-[12px] px-[var(--gutter-x-margin)]"}>
			<div className={"flex flex-row items-center gap-[12px]"}>
				{icon && (
					<div className={"w-[36px] h-[36px] text-zinc-200"}>
						{icon}
					</div>
				)}

				<Title>
					{title}
				</Title>
			</div>
			<Description>
				{description}
			</Description>
		</div>
	);
}