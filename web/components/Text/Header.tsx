/*
Used for describing a consistent text type between a title and a subtitle across the application.
 */
export default function Header({ children, className, ...params } : any) {
	return (
		<h2 className={`text-zinc-200 text-lg font-semibold ${className}`} {...params}>
			{children}
		</h2>
	);
}