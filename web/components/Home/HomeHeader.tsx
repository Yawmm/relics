import LogoIcon from "@/components/Icons/LogoIcon";
import React from "react";
import Link from "next/link";

export default function HomeHeader() {
	return (
		<div className={"sticky top-0 flex flex-row justify-between items-center w-full bg-zinc-900 md:bg-zinc-900 px-gutter py-[calc(theme(margin.gutter-y)/2)] md:py-gutter"}>
			<Link href={"/"}>
				<LogoIcon className={"w-[36px] h-[36px]"} />
			</Link>
		</div>
	);
}