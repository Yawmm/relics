"use client"

import {AnimatePresence, motion} from "framer-motion";
import React from "react";
import Loader from "@/components/Login/Loader";

/*
The types of functions available to load screens.
 */
type LoadScreenProps = {
	/* Whether or not the loading screen is shown. */
	isShown: boolean
}

/*
Used for displaying a full loading screen with a loader to the user.
 */
export default function LoadScreen ({ isShown } : LoadScreenProps) {
	return (
		<AnimatePresence>
			{isShown && (
				<div className={"flex"}>
					<motion.div
						className={"absolute top-0 w-full h-full bg-zinc-900 z-50 bg-opacity-70"}
						transition={{ duration: 0.1 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>
					<motion.div
						className={"absolute top-0 w-full h-full z-50 pointer-events-none"}
						transition={{ duration: 0.1 }}
						initial={{ opacity: 0.6 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div className={"flex w-full h-full justify-center items-center"}>
							<Loader />
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}