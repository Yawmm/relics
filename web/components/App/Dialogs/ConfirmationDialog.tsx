import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";

export type ConfirmationDialogHandle = {
    show: (title: string, warning: string, onConfirm: () => void) => void,
    hide: () => void
};

type ConfirmationDialogProps = {
    onDismiss?: () => void,
}

const ConfirmationDialog = forwardRef<ConfirmationDialogHandle, ConfirmationDialogProps>(({ onDismiss } : ConfirmationDialogProps, ref) => {
    const [title, setTitle] = useState<string | null>(null)
    const [warning, setWarning] = useState<string | null>(null);

    const callback = useRef(() => {});
    const innerDialogRef = useRef<DialogModalHandle>(null);
    
    function confirm() {
        if (callback.current) callback.current();
        innerDialogRef.current?.hide();
    }
    
    useImperativeHandle(ref, () => {
        return {
            show: (t, w, c) => {
                setTitle(t);
                setWarning(w);
                callback.current = c;
                
                innerDialogRef.current?.show();
            },
            hide: () => innerDialogRef.current?.hide()
        }
    })
    
    return (
        <Dialog.Modal ref={innerDialogRef}>
            <Dialog.Container>
                <Dialog.Column>
                    <Title context={"dialog"}>
                        {title}
                    </Title>

                    <Description>
                        {warning}
                    </Description>
                </Dialog.Column>

                <Dialog.Row>
                    <Button focus onClick={() => innerDialogRef.current?.hide()} type={"rounded"} usage={"other"} intent={"secondary"}>
                        <RemoveIcon className={"w-[16px] h-[16px]"}/>
                        Cancel
                    </Button>
                    <Button onClick={() => confirm()} className={"w-full justify-center"} type={"rounded"} usage={"form"} intent={"warn"}>
                        <ConfirmIcon className={"w-[16px] h-[16px]"}/>
                        Confirm
                    </Button>
                </Dialog.Row>
            </Dialog.Container>            
        </Dialog.Modal>
    )
});

export default ConfirmationDialog;