import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import {FormEvent, RefObject} from "react";
import {addTeam} from "@/lib/teams";
import {User} from "@/lib/types";

type CreateProjectDialogProps = {
    dialog: RefObject<DialogModalHandle>
    user: User | null,
}

export default function CreateTeamDialog({ dialog, user } : CreateProjectDialogProps) {
    async function createTeam(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (!user)
            return;

        const data = {
            name: String(event.currentTarget.Name.value),
        };

        dialog.current?.hide();
        await addTeam(data.name, user.id);
        event.currentTarget?.reset();
    }
    
    return (
        <Dialog.Modal ref={dialog}>
            <Dialog.Container>
                <Dialog.Column>
                    <Title context={"dialog"}>
                        Create team
                    </Title>

                    <Description>
                        Create a new team item under the current logged in user.
                    </Description>
                </Dialog.Column>

                <Dialog.Form onSubmit={createTeam}>
                    <Dialog.Column>
                        <InputField
                            focus
                            type={"form"}
                            title={"Name"}
                            placeholder={"Default team"}
                            maximum={20}
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