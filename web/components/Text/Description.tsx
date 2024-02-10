/*
Used for describing a consistent description text across the application.
 */
export default function Description({ children, ...params } : any) {
	return (
		<p className={"text-zinc-400 text-md"} {...params}>
			{children}
		</p>
	);
}