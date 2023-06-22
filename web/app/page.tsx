"use client"

import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import Button from "@/components/Input/Button";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";
import Subtitle from "@/components/Text/Subtitle";

export default function Home() {
    return (
        <div className={"flex flex-col gap-[24px]"}>
            <div className={"flex flex-col w-full gap-[24px] px-[var(--gutter-x-margin)]"}>
                <div className={"flex flex-col gap-[12px]"}>
                    <Title>
                        Manage your events without hassle
                    </Title>
                    <Description>
                        Easily create projects and tasks to manage big and complicated plans.
                    </Description>
                </div>

                <div className={"flex flex-row gap-[12px]"}>
                    <Button type={"rounded"} intent={"primary"} usage={"link"} href={"/sign-up"}>
                        <RightArrowIcon className={"w-[16px] h-[16px]"} />
                        Sign up now
                    </Button>

                    <Button type={"rounded"} intent={"secondary"} usage={"link"} href={"/sign-in"}>
                        Sign in
                    </Button>
                </div>
            </div>

            <div className={"flex flex-col gap-[12px]"}>
                <Subtitle className={"px-[var(--gutter-x-margin)]"}>
                    Projects
                </Subtitle>

                <div className={"flex flex-row gap-[12px] w-full overflow-x-auto px-[var(--gutter-x-margin)]"}>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                </div>
            </div>

            <div className={"flex flex-col gap-[12px]"}>
                <Subtitle className={"px-[var(--gutter-x-margin)]"}>
                    Tasks
                </Subtitle>

                <div className={"flex flex-row gap-[12px] w-full overflow-x-auto px-[var(--gutter-x-margin)]"}>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                </div>
            </div>
        </div>
    )
}
