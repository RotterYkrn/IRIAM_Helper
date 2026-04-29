import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/apps/useAppContext";

/** Dialog.Root に渡すプロパティ */
type Props = {
    className?: string;
};

/**
 * 企画の種類を選択するダイアログ
 *
 * @description
 * 企画新規作成時に、作成する企画の種類を選択するために使用します。
 */
const SelectProjectTypeDialog = ({ className }: Props) => {
    const { setIsOpenSideBar } = useAppContext();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"main" | "endurance-detail">("main");
    const navigate = useNavigate();

    const handleSelect = (type: string) => {
        setOpen(false);
        setIsOpenSideBar(false);
        navigate(`/projects/create/${type}`);
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={setOpen}
        >
            <Dialog.Trigger>
                <Button
                    variant={"outline"}
                    className={twMerge("", className)}
                    onClick={() => setOpen(true)}
                >
                    ＋ 企画新規作成
                </Button>
            </Dialog.Trigger>
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

                    <div className="flex flex-col gap-3 mt-4">
                        {step === "main" ? (
                            <>
                                <Button
                                    variant={"outline"}
                                    size={"lg"}
                                    className="relative border-black"
                                    onClick={() => setStep("endurance-detail")}
                                >
                                    耐久企画
                                    <ChevronRight className="absolute right-2" />
                                </Button>

                                <Button
                                    variant={"outline"}
                                    size={"lg"}
                                    className="border-black"
                                    disabled={true}
                                    onClick={() => handleSelect("panel-open")}
                                >
                                    パネル開け（準備中）
                                </Button>

                                <Button
                                    variant={"outline"}
                                    size={"lg"}
                                    asChild
                                    className="border-black text-blue-600
                                        hover:text-blue-800 hover:underline"
                                >
                                    <a
                                        href="https://namazu-tools.net/super-gacha/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span>
                                            スーパーガチャツール（なまづつーるず）
                                        </span>
                                        <ExternalLink size={16} />
                                    </a>
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Button
                                    variant={"outline"}
                                    size={"lg"}
                                    className="border-black"
                                    onClick={() => handleSelect("endurance")}
                                >
                                    カウント型耐久（単体）
                                </Button>

                                <Button
                                    variant={"outline"}
                                    size={"lg"}
                                    className="border-black"
                                    onClick={() =>
                                        handleSelect("multi-endurance")
                                    }
                                >
                                    カウント型耐久（複数）
                                </Button>

                                <Button
                                    variant={"outline"}
                                    size={"lg"}
                                    className="border-black"
                                    disabled={true}
                                >
                                    ギフト耐久（準備中）
                                </Button>

                                <Button
                                    variant={"outline"}
                                    size={"lg"}
                                    className="relative border-black"
                                    onClick={() => setStep("main")}
                                >
                                    <ChevronLeft className="absolute left-2" />
                                    戻る
                                </Button>
                            </div>
                        )}
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
