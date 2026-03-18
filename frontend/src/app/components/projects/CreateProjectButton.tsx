import { useState } from "react";

import SelectProjectTypeDialog from "./SelectProjectTypeDialog";

type Prop = {
    setSidebarOpen?: (open: boolean) => void;
};

/**
 * 企画新規作成遷移用ボタン\
 * 押下されると、企画タイプを選択するダイアログ {@link SelectProjectTypeDialog} を開く
 */
const CreateProjectButton = ({ setSidebarOpen }: Prop) => {
    const [open, setOpen] = useState(false);

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
                onOpenChange={setOpen}
                setSidebarOpen={setSidebarOpen ?? (() => {})}
            />
        </>
    );
};

export default CreateProjectButton;
