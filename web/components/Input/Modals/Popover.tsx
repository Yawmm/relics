"use client"

import React, {forwardRef, useImperativeHandle, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Button from "@/components/Input/Button";

/*
The properties of the popover.
 */
type PopoverProps = {
	/* The children of the popover component. */
	children: React.ReactNode
}

/*
Used to group together common components for popover functionality in the application.
 */
const Popover = ({ children } : PopoverProps) => {
	return (
		<div className={"relative"}>
			{children}
		</div>
	);
};

/*
The types of functions available to popover modals.
 */
export type PopoverModalHandle = {
	/* Make the popover modal appear. */
	show: () => void,
	/* Make the popover modal disappear. */
	hide: () => void,
	/* Make the popover modal toggle appearance. */
	toggle: () => void,
}

/*
The properties of popover modals.
 */
type PopoverModalProps = {
	/* Styling of the popover window. */
	className?: string,
	/* Called when the popover modal is closed by tapping the back overlay. */
	onClose?: () => void,
	/* The children of the popover modal component. */
	children: React.ReactNode
}

/*
Used to display a modal popover to the user, with a back overlay to grab the user's attention.
 */
const PopoverModal = forwardRef<PopoverModalHandle, PopoverModalProps>(({ className, onClose, children }: PopoverModalProps, ref) => {
	/* Whether or not the popover modal is shown to the user. */
	const [isShown, setIsShown] = useState<boolean>(false);

	/*
	Hide the modal and call the given callback function.
	 */
	function onCloseModal() {
		setIsShown(false);
		if (onClose) onClose();
	}

	/*
	Define the functions available to references to the modal.
	 */
	useImperativeHandle(ref, () => {
		return {
			show: () => setIsShown(true),
			hide: () => setIsShown(false),
			toggle: () => setIsShown(prev => !prev)
		};
	});

	return (
		<AnimatePresence>
			{isShown && (
				<div className={"flex"}>
					<motion.div
						onClick={onCloseModal}
						className={"fixed top-0 bottom-0 left-0 right-0 bg-zinc-900 bg-opacity-70 z-50"}
						transition={{ duration: 0.1 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>
					<motion.div
						className={`absolute right-[0px] p-[12px] bg-zinc-800 rounded-lg ${className} z-50`}
						transition={{ duration: 0.1 }}
						initial={{ opacity: 0.6 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});

/*
The properties of popover button.
 */
type PopoverButtonProps = {
	/* Called when the button is pressed. */
	onClick?: () => void,
	/* Whether or not the button should grab focus on appear. */
	focus?: boolean,
	/* The children of the popover button component. */
	children: React.ReactNode
}

/*
Used to display a general button of a popover modal with a consistent style.
 */
const PopoverButton = ({ onClick, focus, children }: PopoverButtonProps) => {
	return (
		<Button focus={focus} onClick={() => onClick && onClick()} className={"justify-between min-w-[200px]"} intent={"primary"} type={"square"} usage={"form"}>
			{children}
		</Button>
	);
};

/*
The properties of a popover container.
 */
type PopoverContainerProps = {
	children: React.ReactNode
}

/*
Used to define a constant style of containers in popover modals.
 */
const PopoverContainer = ({ children } : PopoverContainerProps) => {
	return (
		<div className={"flex flex-col gap-[12px]"}>
			{children}
		</div>
	);
};

// Assign all the components to the properties of the popover object.
Popover.Modal = PopoverModal;
Popover.Button = PopoverButton;
Popover.Container = PopoverContainer;

// Export the popover object.
export default Popover;