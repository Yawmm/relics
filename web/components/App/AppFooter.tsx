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
		<nav className={"sticky bottom-0 w-full px-[var(--gutter-x-margin)] py-[28px] bg-zinc-700 border-t-zinc-600 border-t-2"}>
			<div className={"flex flex-row justify-between"}>
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
	const iconStyle = `w-[24px] h-[24px] ${isSelected ? "text-zinc-200" : "text-zinc-500"}`;
	const lineStyle = `w-[28px] h-[2px] ${isSelected ? "bg-zinc-200" : "bg-zinc-500"}`;

	return (
		<Link
			href={href}
			className={"flex flex-col justify-center items-center gap-[2px] p-[8px] m-[-8px] focus:outline-none focus:rounded-md focus:ring-4 focus:ring-zinc-500"}
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