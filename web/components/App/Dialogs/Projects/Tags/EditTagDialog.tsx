import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import {FormEvent, RefObject} from "react";
import {Tag} from "@/lib/types";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import {editTag} from "@/lib/tags";

type EditTagDialogProps = {
    dialog: RefObject<DialogModalHandle>,
    tag: Tag | undefined
}

export default function EditTagDialog({ dialog, tag } : EditTagDialogProps) {
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!tag)
            return;

        const data = {
            name: String(event.currentTarget.Name.value),
            color: String(event.currentTarget.Color.value)
        };

        dialog.current?.hide();
        await editTag(tag.id, { name: data.name, color: data.color });
        event.currentTarget?.reset();
    }

    return (
        <Dialog.Modal ref={dialog}>
            <Dialog.Container>
                <Dialog.Column>
                    <h2>
                        Edit tag
                    </h2>

                    <p>
                        Change the properties of a tag to better match your idea of the tag.
                    </p>
                </Dialog.Column>

                <Dialog.Form onSubmit={submit}>
                    <Dialog.Column>
                        <InputField
                            focus
                            type={"form"}
                            title={"Name"}
                            placeholder={"Default tag"}
                            value={tag?.name}
                            maximum={20}
                            required
                        />

                        <InputField
                            type={"color"}
                            title={"Color"}
                            value={tag?.color}
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