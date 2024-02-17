import React, {FormEvent, RefObject, useEffect, useRef, useState} from "react";
import {Category, Project, Task} from "@/lib/types";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import Toggle from "@/components/Input/Toggle";
import {editTask} from "@/lib/tasks";
import ChoiceDialog from "@/components/App/Dialogs/ChoiceDialog";

type EditTaskDialogProps = {
    dialog: RefObject<DialogModalHandle>,
    project: Project | undefined
    category: Category | undefined
    task: Task | undefined
}

export default function EditTaskDialog({ dialog, project, category, task } : EditTaskDialogProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(category ?? null);

    const choiceDialogRef = useRef<DialogModalHandle>(null);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!task)
            return;

        const data = {
            name: String(event.currentTarget.Name.value),
            description: String(event.currentTarget.Description.value),
            isFinished: Boolean(event.currentTarget.Finished.checked),
        };
        
        dialog.current?.hide();
        await editTask(
            task.id,
            {
                name: data.name,
                description: data.description,
                isFinished: data.isFinished,
                categoryId: !selectedCategory ? null : selectedCategory?.id
            }
        );
        event.currentTarget?.reset();
    }

    useEffect(() => {
        setSelectedCategory(category ?? null);
    }, [category, project, task]);
    
    return (
        <>
            <Dialog.Modal ref={dialog}>
                <Dialog.Container>
                    <Dialog.Column>
                        <Title context={"dialog"}>
                            Edit task
                        </Title>

                        <Description>
                            Change the properties of a task to better match your idea of the task.
                        </Description>
                    </Dialog.Column>

                    <Dialog.Form onSubmit={submit}>
                        <Dialog.Column>
                            <InputField
                                focus
                                maximum={20}
                                type={"form"}
                                title={"Name"}
                                placeholder={"Default task"}
                                required={true}
                                value={task?.name}
                            />

                            <InputField
                                type={"form"}
                                title={"Description"}
                                placeholder={"This is a default task."}
                                required={true}
                                value={task?.description}
                            />

                            <Button
                                onClick={() => choiceDialogRef.current?.show()}
                                type={"square"}
                                usage={"other"}
                                intent={"tertiary"}
                                disabled={!project?.categories || project.categories.length <= 0}
                                className={"justify-between"}
                            >
                                {selectedCategory ? selectedCategory.name : "Category"}
                                <RightArrowIcon className={"w-[16px] h-[16px]"}/>
                            </Button>

                            <Toggle>
                                <Toggle.Option id={"Finished"} value={task?.isFinished} />
                                Is finished
                            </Toggle>
                        </Dialog.Column>

                        <Dialog.Row>
                            <Button onClick={() => dialog.current?.hide()} type={"rounded"} usage={"form"} intent={"secondary"}>
                                <RemoveIcon className={"w-[16px] h-[16px]"}/>
                                Cancel
                            </Button>
                            <Button className={"w-full justify-center"} type={"rounded"} usage={"form"} intent={"primary"}>
                                <ConfirmIcon className={"w-[16px] h-[16px]"}/>
                                Confirm
                            </Button>
                        </Dialog.Row>
                    </Dialog.Form>
                </Dialog.Container>
            </Dialog.Modal>
            <ChoiceDialog
                dialog={choiceDialogRef}
                options={project?.categories.map(c => ({ id: c.id, name: c.name })) ?? []}

                onSelectOption={id => setSelectedCategory(project?.categories.find(c => c.id == id) ?? null)}
                onResetOption={() => setSelectedCategory(null)}
            />
        </>
    );
}