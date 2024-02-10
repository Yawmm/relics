import LogoIcon from "@/components/Icons/LogoIcon";
import React from "react";
import Link from "next/link";

export default function HomeHeader() {
	return (
		<div className={"sticky flex flex-row justify-between items-center top-0 w-full px-[var(--gutter-x-margin)] pt-[var(--gutter-y-margin)] pb-[calc(var(--gutter-y-margin)/2)] bg-zinc-800"}>
			<Link href={"/"}>
				<LogoIcon className={"w-[24px] h-[24px]"} />
			</Link>
		</div>
	);
}