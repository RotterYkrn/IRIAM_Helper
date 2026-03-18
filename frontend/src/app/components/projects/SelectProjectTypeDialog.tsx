import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

/** Dialog.Root に渡すプロパティ */
type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setSidebarOpen: (open: boolean) => void;
};

/**
 * 企画の種類を選択するダイアログ
 *
 * @description
 * 企画新規作成時に、作成する企画の種類を選択するために使用します。
 */
const SelectProjectTypeDialog = ({
    open,
    onOpenChange,
    setSidebarOpen,
}: Props) => {
    const navigate = useNavigate();

    const handleSelect = (type: string) => {
        onOpenChange(false);
        setSidebarOpen(false);
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
                            className="rounded border p-3 hover:bg-gray-300
                                transition-colors"
                            onClick={() => handleSelect("endurance")}
                        >
                            カウント型耐久（単体）
                        </button>

                        <button
                            className="rounded border p-3 hover:bg-gray-300
                                transition-colors"
                            onClick={() => handleSelect("multi-endurance")}
                        >
                            カウント型耐久（複数）（準備中）
                        </button>

                        <button
                            className="rounded border p-3 bg-gray-500"
                            disabled={true}
                            onClick={() => {}}
                        >
                            その他耐久（準備中）
                        </button>

                        <button
                            className="rounded border p-3 bg-gray-500"
                            disabled={true}
                            onClick={() => handleSelect("panel-open")}
                        >
                            パネル開け（準備中）
                        </button>

                        <a
                            href="https://namazu-tools.net/super-gacha/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2
                                rounded border border-black p-3
                                hover:bg-gray-300 hover:text-blue-600
                                hover:underline transition-colors"
                        >
                            <span>スーパーガチャツール（なまづつーるず）</span>
                            <ExternalLink size={16} />
                        </a>
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
