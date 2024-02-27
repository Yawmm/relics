import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
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
    const [title, setTitle] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    const callback = useRef(() => {});
    const innerDialogRef = useRef<DialogModalHandle>(null);
    
    function confirm() {
        if (callback.current) callback.current();
        innerDialogRef.current?.hide();
    }

    function dismiss() {
        if (onDismiss) onDismiss();
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
        };
    });
    
    return (
        <Dialog.Modal ref={innerDialogRef}>
            <Dialog.Container>
                <Dialog.Column>
                    <h2>
                        {title}
                    </h2>

                    <p>
                        {warning}
                    </p>
                </Dialog.Column>

                <Dialog.Row>
                    <Button focus onClick={dismiss} type={"rounded"} usage={"other"} intent={"secondary"}>
                        <RemoveIcon className={"small-icon"}/>
                        Cancel
                    </Button>
                    <Button onClick={confirm} className={"w-full justify-center"} type={"rounded"} usage={"form"} intent={"warn"}>
                        <ConfirmIcon className={"small-icon"}/>
                        Confirm
                    </Button>
                </Dialog.Row>
            </Dialog.Container>            
        </Dialog.Modal>
    );
});

export default ConfirmationDialog;