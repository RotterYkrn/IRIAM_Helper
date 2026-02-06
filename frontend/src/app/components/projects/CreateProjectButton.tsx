import { useState } from "react";

import SelectProjectTypeDialog from "./SelectProjectTypeDialog";

type Props = {
    toggleSidebar: () => void;
};

const CreateProjectButton = ({ toggleSidebar }: Props) => {
    const [open, setOpen] = useState(false);

    const onOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        toggleSidebar();
    };

    return (
        <>
            <button
                className="flex w-full items-center rounded transition-colors
                    hover:bg-neutral-300"
                onClick={() => setOpen(true)}
            >
                ＋ 企画新規作成
            </button>

            <SelectProjectTypeDialog
                open={open}
                onOpenChange={onOpenChange}
            />
        </>
    );
};

export default CreateProjectButton;
