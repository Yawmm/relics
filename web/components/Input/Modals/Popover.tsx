"use client";

import React, {forwardRef, RefObject, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Button from "@/components/Input/Button";
import useWindowDimensions from "@/hooks/windowDimensions";

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
		<div>
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
	/* The reference to the button to which the modal should be anchored. */
	anchor?: RefObject<HTMLButtonElement>
	/* The children of the popover modal component. */
	children: React.ReactNode
}

/*
Used to display a modal popover to the user, with a back overlay to grab the user's attention.
 */
const PopoverModal = forwardRef<PopoverModalHandle, PopoverModalProps>(({ className, onClose, anchor, children }: PopoverModalProps, ref) => {
	/* Whether the popover modal is shown to the user. */
	const [isShown, setIsShown] = useState<boolean>(false);

	/* The current offset of the anchor and of the actual popover element */
	const [anchorOffset, setAnchorOffset] = useState<DOMRect | undefined>();
	const [selfOffset, setSelfOffset] = useState<DOMRect | undefined>();

	/* The reference to the popover element. */
	const self = useRef<HTMLDivElement>(null);

	/* The current dimensions of the window. */
	const dimensions = useWindowDimensions();

	/* The offsets which should be used in calculating the position of the popover. */
	const leftOffset = useMemo(() => !anchorOffset || !selfOffset ? 0 : anchorOffset.left + anchorOffset.width - (anchorOffset.right + selfOffset.width > dimensions.width ? selfOffset.width : 0), [anchorOffset, selfOffset, dimensions]);
	const topOffset = useMemo(() => !anchorOffset ? 0 : anchorOffset.top + anchorOffset.height, [anchorOffset]);

	const isVisible = useMemo(() => anchorOffset !== undefined && selfOffset !== undefined && isShown, [anchorOffset, selfOffset, isShown]);

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

	/*
	Update the offset values of the anchor and of the current element when the popover element is toggled.
	 */
	useEffect(() => {
		setAnchorOffset(anchor?.current?.getBoundingClientRect());
		setSelfOffset(self?.current?.getBoundingClientRect());
	}, [isShown]);

	return (
		<AnimatePresence>
			{isShown && (
				<div className={"fixed"}>
					<motion.div
						onClick={onCloseModal}
						className={"fixed top-0 bottom-0 left-0 right-0 bg-zinc-900 bg-opacity-70 z-50"}
						transition={{ duration: 0.1 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>
					<motion.div
						ref={self}
						className={`fixed p-[12px] bg-zinc-800 rounded-lg ${className} z-50`}
						style={{ left: `${leftOffset}px`, top: `${topOffset}px`, visibility: isVisible ? "visible" : "hidden" }}
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