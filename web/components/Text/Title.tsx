import React from "react";

/*
The context of where the title component is located.
 */
type TitleContext = "default" | "dialog"

/*
The properties of a title component.
 */
type TitleProps = {
	/* The context of where the title component is located to adjust font sizes.*/
	context?: TitleContext
	/* The children of the title component. */
	children: React.ReactNode
}

/*
Used for describing a consistent title text across the application.
 */
export default function Title({ context = "default", children, ...params } : TitleProps) {
	const style = "text-zinc-200 font-bold"
		+ (context == "default" ? " text-3xl" : "")
		+ (context == "dialog" ? " text-2xl" : "");

	return (
		<h1 className={style} {...params}>
			{children}
		</h1>
	)
}