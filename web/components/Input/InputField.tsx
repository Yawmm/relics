import {HTMLInputTypeAttribute} from "react";

/*
The properties of the input field.
 */
type InputFieldProps = {
	/* The minimum amount of characters required for the input field */
	minimum?: number,
	/* The maximum amount of characters required for the input field */
	maximum?: number,

	/* Whether or not the input field is disabled. */
	disabled?: boolean,
	/* Whether or not the input field is required. */
	required?: boolean
	/* The placeholder of the input field. */
	placeholder?: string,
	/* The current value of the input field. */
	value?: string,
	/* Whether or not the field should grab focus on appear. */
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
			focus-within:ring-2 focus-within:ring-main-500`
		}>
			<label htmlFor={title} className={"text-zinc-400 text-sm"}>
				{title}{required && "*"}
			</label>
			<input
				autoFocus={focus}
				defaultValue={value}
				disabled={disabled}
				minLength={minimum}
				maxLength={maximum}
				className={`text-zinc-200 text-md bg-transparent
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
		</div>
	)
}