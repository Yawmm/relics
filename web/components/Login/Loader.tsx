"use client"

import LoaderIcon from "@/components/Icons/LoaderIcon";
import {motion} from "framer-motion"

/*
A spinning loading component to show the user that data is loading.
 */
export default function Loader() {
	return (
		<motion.div
			transition={{
				duration: 1,
				repeat: Infinity,
				ease: 'backIn'
			}}
			animate={{
				rotate: 360,
			}}
		>
			<LoaderIcon className={"w-[36px] h-[36px] text-zinc-400"}/>
		</motion.div>
	)
}