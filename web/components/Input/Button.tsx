import Link from "next/link";

/*
The consistent type of style of a button.
*/
type ButtonStyle = "primary" | "secondary" | "tertiary" | "warn" | "other";

/*
The consistent background type of a button.
 */
type ButtonType = "square" | "rounded" | "circle";

/*
The type of input of a button.
 */
type ButtonUsage = "link" | "form" | "other";

/*
The properties of a button.
 */
export type ButtonProps = {
	type: ButtonType
	usage: ButtonUsage
	intent: ButtonStyle
	onClick?: () => void
	href?: string
	className?: string,
	disabled?: boolean,
	focus?: boolean,
	children: any
}

/*
Used to define a consistent button across the application.
 */
export default function Button(
	{
		type,
		usage,
		intent,
		onClick,
		href,
		className,
		disabled,
		focus,
		children,
		...props
	} : ButtonProps) {
	/* The definitive style of the button/link. */
	const style = `flex flex-row items-center gap-[4px] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-main-500`
		+ (type == "square" ? " justify-center w-full px-[24px] py-[16px] rounded-lg" : "")
		+ (type == "rounded" ? " px-[24px] py-[8px] rounded-2xl" : "")
		+ (type == "circle" ? " rounded-3xl aspect-square" : "")
		+ (disabled ? " bg-zinc-900"
			: "" + (intent == "primary" ? " p-[10px] bg-main-700 hover:bg-main-600 active:bg-main-900" : "")
			+ (intent == "secondary" ? " p-[8px] bg-zinc-800 border-zinc-700 border-2 hover:bg-zinc-700 active:bg-zinc-900" : "")
			+ (intent == "tertiary" ? " p-[10px] bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-700" : "")
			+ (intent == "other" ? " p-[10px]" : "")
			+ (intent == "warn" ? " p-[10px] bg-red-700 hover:bg-red-600 active:bg-red-900" : ""))
		+ (disabled ? " text-zinc-400" : "")
		+ (className ? ` ${className}` : "")

	switch (usage) {
		case "link":
			return (
				<Link
					href={href!}
					className={style}
					autoFocus={focus}
					{...props}
				>
					{children}
				</Link>
			)

		case "other":
		case "form":
			return (
				<button
					type={usage === "form" ? "submit" : "button"}
					onClick={() => onClick != undefined ? onClick() : null}
					className={style}
					disabled={disabled}
					autoFocus={focus}
					{...props}
				>
					{children}
				</button>
			)
	}
}