import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import {FormEvent, RefObject} from "react";
import {Project} from "@/lib/types";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import {editProject} from "@/lib/projects";

type EditProjectDialogProps = {
    dialog: RefObject<DialogModalHandle>,
    project: Project | null
}

export default function EditProjectDialog({ dialog, project } : EditProjectDialogProps) {
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (!project)
            return;

        const data = {
            name: String(event.currentTarget.Name.value),
            description: String(event.currentTarget.Description.value)
        };

        dialog.current?.hide();
        await editProject(project.id, data.name, data.description);
        event.currentTarget?.reset();
    }
    
    return (
        <Dialog.Modal ref={dialog}>
            <Dialog.Container>
                <Dialog.Column>
                    <h2>
                        Edit project
                    </h2>
                    
                    <p>
                        Change the properties of a project to better match your idea of the project.
                    </p>
                </Dialog.Column>
                
                <Dialog.Form onSubmit={submit}>
                    <Dialog.Column>
                        <InputField
                            focus
                            type={"form"}
                            title={"Name"}
                            placeholder={"Default project"}
                            value={project?.name}
                            maximum={20}
                            required
                        />
                        <InputField
                            type={"form"}
                            title={"Description"}
                            placeholder={"This is a default project."}
                            value={project?.description}
                            required
                        />
                    </Dialog.Column>
                    
                    <Dialog.Row>
                        <Button onClick={() => dialog.current?.hide()} type={"rounded"} usage={"other"} intent={"secondary"}>
                            <RemoveIcon className={"small-icon"}/>
                            Cancel
                        </Button>
                        <Button className={"w-full justify-center"} type={"rounded"} usage={"form"} intent={"primary"}>
                            <ConfirmIcon className={"small-icon"}/>
                            Confirm
                        </Button>
                    </Dialog.Row>
                </Dialog.Form>
            </Dialog.Container>
        </Dialog.Modal>
    );
}