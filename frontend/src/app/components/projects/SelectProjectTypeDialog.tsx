import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom"; // Nextなら useRouter

const SelectProjectTypeDialog = ({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const navigate = useNavigate();

    const handleSelect = (type: string) => {
        onOpenChange(false);
        navigate(`/projects/create/${type}`);
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <Dialog.Portal>
                <Dialog.Overlay className="fixed z-45 inset-0 bg-black/50" />

                <Dialog.Content
                    className="fixed z-50 left-1/2 top-1/2 w-[90vw] max-w-md
                        -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white
                        p-6 shadow-lg"
                >
                    <Dialog.Title className="text-lg font-bold mb-4">
                        企画の種類を選択
                    </Dialog.Title>
                    <Dialog.DialogDescription>
                        新しく作成する企画の種類を選択してください。
                    </Dialog.DialogDescription>

                    <div className="flex flex-col gap-3">
                        <button
                            className="rounded border p-3 hover:bg-gray-100"
                            onClick={() => handleSelect("endurance")}
                        >
                            入室耐久
                        </button>

                        <button
                            className="rounded border p-3 bg-gray-500"
                            disabled={true}
                            onClick={() => handleSelect("gacha")}
                        >
                            ガチャ企画（準備中）
                        </button>

                        <button
                            className="rounded border p-3 bg-gray-500"
                            disabled={true}
                            onClick={() => handleSelect("panel-open")}
                        >
                            パネル開け（準備中）
                        </button>
                    </div>

                    <Dialog.Close
                        className="absolute right-3 top-3 text-gray-400
                            hover:text-black"
                    >
                        ✕
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default SelectProjectTypeDialog;
