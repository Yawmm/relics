"use client";

import React, {forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState} from "react";
import {AnimatePresence, motion, PanInfo, useDragControls} from "framer-motion";

/*
Used to group together common components for sheet functionality in the application.
 */
const Sheet = () => { return (<></>); };

/*
The types of functions available to sheet modals.
 */
export type SheetModalHandle = {
	/* Make the sheet modal appear. */
	show: () => void,
	/* Make the sheet modal disappear. */
	hide: () => void,
	/* Make the sheet modal toggle appearance. */
	toggle: () => void,
}

/*
The properties of sheet modals.
 */
type SheetModalProps = {
	/* Called when the sheet modal is closed by tapping the back overlay. */
	onClose?: () => void,
	/* The children of the sheet modal component. */
	children: React.ReactNode
}

const SheetModal = forwardRef<SheetModalHandle, SheetModalProps>(({ onClose, children } : SheetModalProps, ref) => {
	/* Whether or not the sheet modal is shown to the user. */
	const [isShown, setIsShown] = useState<boolean>(false);
	/* The current height of the modal. */
	const [height, setHeight] = useState<number>(200);

	/* The reference to the root element of the content element of the sheet, for animations. */
	const rootRef = useRef<HTMLDivElement>(null);
	/* Drag controls from framer to control animations. */
	const barDragControls = useDragControls();

	/*
	Close and dismiss the sheet, optionally with info about the pointer event to
	determine if the sheet should be closed when the velocity of the pointer is
	above a given threshold.
	 */
	function closeSheet(info?: PanInfo) {
		if (info && info.velocity.y <= 150)
			return;

		setIsShown(false);
		if (onClose)
			onClose();
	}

	/*
	Update the height of the sheet on layout update, used to calculate animation offsets.
	 */
	useLayoutEffect(() => {
		if (rootRef.current !== null)
			setHeight(rootRef.current.offsetHeight);
	});

	/*
	Define the functions available to references to the modal.
	 */
	useImperativeHandle(ref, () => {
		return {
			show: () => setIsShown(true),
			hide: () => setIsShown(false),
			toggle: () => setIsShown(prev => !prev),
		};
	});

	return (
		<AnimatePresence>
			{isShown && (
				<div className={"fixed top-0 bottom-0 left-0 right-0 overflow-hidden z-40"}>
					<motion.div
						onClick={() => closeSheet()}
						className={"fixed w-full h-full bg-zinc-900 z-40 bg-opacity-70"}

						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>
					<motion.div
						className={"fixed bottom-0 w-full h-fit z-40 pointer-events-none"}

						onDragEnd={(e, info) => closeSheet(info)}

						dragControls={barDragControls}
						dragConstraints={rootRef}
						dragElastic={{ bottom: 0.2 }}
						dragSnapToOrigin
						drag={"y"}

						transition={{ duration: 0.2, ease: "easeOut" }}
						initial={{ y: height }}
						animate={{ y: 0 }}
						exit={{ y: height }}
					>
						<div className={"flex w-full h-fit justify-center items-end"}>
							<div
								ref={rootRef}
								className={"flex flex-col w-full h-full gap-[24px] px-[36px] py-[24px] bg-zinc-800 rounded-t-2xl pointer-events-auto"}
							>
								<div onPointerDown={e => barDragControls.start(e)} className={"flex justify-center w-full"}>
									<motion.div className={"w-[10%] h-[4px] bg-zinc-400 rounded-3xl"}/>
								</div>

								{children}
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});


/*
The properties of sheet sections (columns, rows, etc.).
 */
type SheetSectionProps = {
	children: React.ReactNode
}

/*
Used to define a constant style of vertical item separation which should be used in sheet modals.
 */
const SheetColumn = ({ children } : SheetSectionProps) => {
	return (
		<div className={"flex flex-col gap-[12px]"}>
			{children}
		</div>
	);
};

/*
Used to define a constant style of horizontal item separation which should be used in sheet modals.
 */
const SheetRow = ({ children } : SheetSectionProps) => {
	return (
		<div className={"flex flex-row gap-[12px]"}>
			{children}
		</div>
	);
};

/*
The properties of sheet containers (columns, rows, etc.).
 */
type SheetContainerProps = {
	children: React.ReactNode
}

/*
Used to define a constant style of containers in sheet modals.
 */
const SheetContainer = ({ children } : SheetContainerProps) => {
	return (
		<div className={"flex flex-col gap-[24px]"}>
			{children}
		</div>
	);
};

// Assign all the components to the properties of the sheet object.
Sheet.Modal = SheetModal;
Sheet.Container = SheetContainer;
Sheet.Column = SheetColumn;
Sheet.Row = SheetRow;

// Export the sheet object.
export default Sheet;