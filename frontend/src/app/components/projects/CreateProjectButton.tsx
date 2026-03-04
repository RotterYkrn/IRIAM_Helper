import { useState } from "react";

import SelectProjectTypeDialog from "./SelectProjectTypeDialog";

type Props = {
    /** サイドバーの開閉を切り替えるハンドラ */
    toggleSidebar: () => void;
};

/**
 * 企画新規作成遷移用ボタン\
 * 押下されると、企画タイプを選択するダイアログ {@link SelectProjectTypeDialog} を開く
 */
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
