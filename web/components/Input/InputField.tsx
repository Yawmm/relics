import {HTMLInputTypeAttribute} from "react";

/*
The properties of the input field.
 */
type InputFieldProps = {
	/* The minimum amount of characters required for the input field */
	minimum?: number,
	/* The maximum amount of characters required for the input field */
	maximum?: number,

	/* Whether the input field is disabled. */
	disabled?: boolean,
	/* Whether the input field is required. */
	required?: boolean
	/* The placeholder of the input field. */
	placeholder?: string,
	/* The current value of the input field. */
	value?: string,
	/* Whether the field should grab focus on appear. */
	focus?: boolean,

	/* The type of the input field. */
	type: HTMLInputTypeAttribute,
	/* The title of the input field. */
	title: string,
}

/*
Used to define a consistent input field across the application.
 */
export default function InputField(
	{
		minimum,
		maximum,

		disabled,
		required = false,
		placeholder,
		value,
		focus,

		type,
		title,
	} : InputFieldProps) {
	return (
		<div className={`flex flex-col w-full px-[24px] py-[12px] bg-zinc-700 rounded-lg
			focus-within:ring-4 focus-within:ring-zinc-500`
		}>
			<label htmlFor={title}>
				{title}{required && "*"}
			</label>
			{type === "color" ? (
				<input
					defaultValue={value}
					className={`w-full h-[36px] md:h-[48px] rounded-lg`}
					type={type}
					id={title}
					name={title}
					required={required}
				/>
			) : (
				<input
					autoFocus={focus}
					defaultValue={value}
					disabled={disabled}
					minLength={minimum}
					maxLength={maximum}
					className={` bg-transparent
					autofill:fill-violet-800 autofill:rounded-md
					placeholder:text-zinc-500
					focus:outline-none`
					}
					placeholder={placeholder}
					type={type}
					id={title}
					name={title}
					required={required}
				/>
			)}
		</div>
	);
}