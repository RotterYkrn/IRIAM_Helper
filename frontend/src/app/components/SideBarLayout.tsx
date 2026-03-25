import { ExternalLink } from "lucide-react";
import { Suspense } from "react";

import CreateProjectButton from "./projects/CreateProjectButton";
import ProjectSideBarLayout from "./projects/ProjectSideBarLayout";

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
                <button
                    onClick={() => setIsOpenSideBar(false)}
                    className="flex h-8 w-8 items-center justify-center
                        rounded-md transition hover:bg-pink-100"
                >
                    ×
                </button>
            </div>
            <div className="flex min-h-screen w-70 flex-col p-4">
                {/* 上部コンテンツ：space-y-4 で間隔を保ち、flex-1 で残りのスペースを専有 */}
                <div className="flex-1 space-y-4 overflow-y-auto">
                    <CreateProjectButton />
                    <Suspense fallback={<div>読込中...</div>}>
                        <ProjectSideBarLayout />
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
