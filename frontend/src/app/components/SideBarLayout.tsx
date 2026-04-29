import { ExternalLink } from "lucide-react";
import { Suspense } from "react";

import SelectProjectTypeDialog from "./projects/presenters/SelectProjectTypeDialog";
import SideBarProjectListContainer from "./projects/side-bar-project-lists/SideBarProjectListContainer";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/apps/useAppContext";

/**
 * サイドバーのレイアウトを定義します。
 */
const SideBarLayout = () => {
    const { setIsOpenSideBar } = useAppContext();

    return (
        <div>
            <div
                className="flex h-12 bg-pink-200 items-center justify-start
                    px-2"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="active:scale-100"
                    onClick={() => setIsOpenSideBar(false)}
                >
                    ×
                </Button>
            </div>
            <div className="flex min-h-screen w-70 flex-col px-2 py-4">
                {/* 上部コンテンツ：space-y-4 で間隔を保ち、flex-1 で残りのスペースを専有 */}
                <div className="flex-1 space-y-4 overflow-y-auto">
                    <SelectProjectTypeDialog
                        variant={"ghost"}
                        className="w-full justify-start px-2"
                    />
                    <Suspense fallback={<div>読込中...</div>}>
                        <SideBarProjectListContainer />
                    </Suspense>
                </div>

                {/* 下部固定コンテンツ：mt-auto で一番下へ押しやる */}
                <div className="sticky bottom-8 space-y-4">
                    <a
                        href="https://namazu-tools.net/border-guardian/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600
                            hover:underline"
                    >
                        <span>ボーダー集計（なまづつーるず）</span>
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SideBarLayout;
