"use client";

import HomeIcon from "@/components/Icons/HomeIcon";
import React from "react";
import TeamIcon from "@/components/Icons/TeamIcon";
import ProjectIcon from "@/components/Icons/ProjectIcon";
import TaskIcon from "@/components/Icons/TaskIcon";
import UserIcon from "@/components/Icons/UserIcon";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function AppFooter() {
	const path = usePathname();

	return (
		<nav className={"fixed md:sticky bottom-0 lg:left-0 w-full lg:h-[calc(100vh-132px)] px-gutter lg:px-[36px] py-[28px] lg:py-[calc(theme(margin.gutter-y)*2)] bg-zinc-700 border-zinc-600 border-t-2 lg:border-t-0 lg:border-r-4"}>
			<div className={"flex flex-row lg:flex-col lg:h-full justify-between"}>
				<NavigationItem icon={<HomeIcon />} isSelected={path.endsWith("/app")} href={"/app"} />
				<NavigationItem icon={<TeamIcon />} isSelected={path.startsWith("/app/teams")} href={"/app/teams"} />
				<NavigationItem icon={<ProjectIcon />} isSelected={path.startsWith("/app/projects")} href={"/app/projects"} />
				<NavigationItem icon={<TaskIcon />} isSelected={path.startsWith("/app/tasks")} href={"/app/tasks"} />
				<NavigationItem icon={<UserIcon />} isSelected={path.startsWith("/app/user")} href={"/app/user"} />
			</div>
		</nav>
	);
}

type NavigationItemProps = {
	icon: JSX.Element,
	isSelected: boolean,
	href: string
}

function NavigationItem({ href, icon, isSelected } : NavigationItemProps) {
	const iconStyle = `w-[24px] md:w-[36px] h-[24px] md:h-[36px] ${isSelected ? "text-zinc-200" : "text-zinc-500"}`;
	const lineStyle = `w-[28px] md:w-[44px] h-[2px] md:h-[4px] ${isSelected ? "bg-zinc-200" : "bg-zinc-500"}`;

	return (
		<Link
			href={href}
			className={"flex flex-col justify-center items-center gap-[2px] p-[8px] md:p-[16px] m-[-8px] focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"}
		>
			<div className={iconStyle}>
				{icon}
			</div>
			{isSelected &&
				<div className={lineStyle} />
			}
		</Link>
	);
}