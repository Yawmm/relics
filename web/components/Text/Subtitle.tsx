/*
Used for describing a consistent subtitle text across the application.
 */
export default function Subtitle({ children, className, ...params } : any) {
	return (
		<h2 className={`text-zinc-200 text-xl font-semibold ${className}`} {...params}>
			{children}
		</h2>
	);
}