import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import {FormEvent, RefObject} from "react";
import {addProject} from "@/lib/projects";
import {User} from "@/lib/types";

type CreateProjectDialogProps = {
    dialog: RefObject<DialogModalHandle>
    user: User | null,

    onUpdate?: () => void,
}

export default function CreateProjectDialog({ dialog, user, onUpdate } : CreateProjectDialogProps) {
    async function createProject(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (!user)
            return;

        const data = {
            name: String(event.currentTarget.Name.value),
            description: String(event.currentTarget.Description.value),
        };

        await addProject(data.name, data.description, user.id);
        if (onUpdate) onUpdate();

        dialog.current?.hide();
        event.currentTarget?.reset();
    }
    
    return (
        <Dialog.Modal ref={dialog}>
            <Dialog.Container>
                <Dialog.Column>
                    <Title context={"dialog"}>
                        Create project
                    </Title>

                    <Description>
                        Create a new project item under the current logged in user.
                    </Description>
                </Dialog.Column>

                <Dialog.Form onSubmit={createProject}>
                    <Dialog.Column>
                        <InputField
                            focus
                            type={"form"}
                            title={"Name"}
                            placeholder={"Default project"}
                            maximum={20}
                            required
                        />
                        <InputField
                            type={"form"}
                            title={"Description"}
                            placeholder={"This is a default project."}
                            required
                        />
                    </Dialog.Column>

                    <Dialog.Row>
                        <Button onClick={() => dialog.current?.hide()} type={"rounded"} usage={"other"} intent={"secondary"}>
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
    );
}