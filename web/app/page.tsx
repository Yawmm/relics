"use client";

import Button from "@/components/Input/Button";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";

export default function Home() {
    return (
        <div className={"flex flex-col gap-[24px] pb-gutter pt-[calc(theme(margin.gutter-y)/2)] md:pt-gutter"}>
            <div className={"flex flex-col w-full gap-[24px] px-gutter"}>
                <div className={"flex flex-col gap-[12px]"}>
                    <h1>
                        Manage your events without hassle
                    </h1>
                    <p>
                        Easily create projects and tasks to manage big and complicated plans.
                    </p>
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
                <h3 className={"px-gutter"}>
                    Projects
                </h3>

                <div className={"flex flex-row gap-[12px] w-full overflow-x-clip px-gutter"}>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"}/>
                </div>
            </div>

            <div className={"flex flex-col gap-[12px]"}>
            <h3 className={"px-gutter"}>
                    Tasks
                </h3>

                <div className={"flex flex-row gap-[12px] w-full overflow-x-clip px-gutter"}>
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                    <div className={"min-w-[200px] h-[250px] bg-zinc-700 rounded-xl"} />
                </div>
            </div>
        </div>
    );
}
