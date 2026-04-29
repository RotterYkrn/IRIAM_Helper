import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import MainHeader from "./MainHeader";
import SideBarLayout from "./SideBarLayout";
import VersionLabel from "./VersionLabel";

import { useAppContext } from "@/contexts/apps/useAppContext";

/**
 * ページ全体の基礎レイアウトを定義します。
 * Routeの最上位に配置してください。
 */
const Layout = () => {
    const { isOpenSideBar, setIsOpenSideBar } = useAppContext();

    return (
        <>
            {/* 開いたら、左からメインにかぶさって出てくるサイドバー */}
            <aside
                className={`fixed top-0 left-0 h-screen z-40 rounded-r-2xl
                    overflow-hidden bg-white border-r border-gray-400 shadow
                    transition-[width] duration-300 ease-in-out
                    ${isOpenSideBar ? "w-70" : "w-0"} `}
            >
                <SideBarLayout />
            </aside>

            {/* サイドバーを開いたら、背景を暗くする */}
            {isOpenSideBar && (
                <div
                    className="fixed inset-0 bg-black/40 z-30"
                    onClick={() => setIsOpenSideBar(false)}
                />
            )}

            <div className={"min-h-screen bg-pink-50 flex flex-col"}>
                <MainHeader />
                <main
                    className="flex-1 p-4 md:p-8 flex justify-center
                        items-start"
                >
                    <div
                        className="w-full max-w-4xl bg-white rounded-xl border
                            border-slate-200 shadow-sm p-6"
                    >
                        <Suspense
                            fallback={
                                <div className="text-center">
                                    企画を読込中...
                                </div>
                            }
                        >
                            <Outlet />
                        </Suspense>
                    </div>
                </main>
                <VersionLabel />
            </div>
        </>
    );
};

export default Layout;
