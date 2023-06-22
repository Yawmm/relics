import React from "react";

type ToggleProps = {
    children: React.ReactNode,
}

const Toggle = ({ children } : ToggleProps) => {
    return (
        <div className={"flex flex-row items-center gap-[12px] py-[8px] text-zinc-200 text-sm"}>
            {children}
        </div>
    )
}

type ToggleOptionProps = {
    id: string,
    value?: boolean,
}

const ToggleOption = ({ id, value = false }: ToggleOptionProps) => {
    return (
        <div className={"relative inline-flex items-center cursor-pointer"}>
            <input
                className={"absolute w-full h-full peer appearance-none focus:outline-none"}
                defaultChecked={value}
                type={"checkbox"}
                id={id}
            />
            <div className={"flex items-center justify-begin px-[4px] peer w-[48px] h-[24px] bg-zinc-700 rounded-3xl peer-checked:bg-main-700 peer-checked:justify-end peer-focus:ring-2 peer-focus:ring-main-500"}>
                <div className={"w-[16px] h-[16px] bg-zinc-800 rounded-3xl"} />
            </div>
        </div>
        
    )
}

Toggle.Option = ToggleOption;

export default Toggle;