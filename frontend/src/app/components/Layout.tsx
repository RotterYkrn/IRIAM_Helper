import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

import MainHeader from "./MainHeader";
import SideBarLayout from "./SideBarLayout";

const Layout = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <aside
                className={`fixed top-0 left-0 h-screen z-40 rounded-r-2xl
                    overflow-hidden bg-white border-r border-black
                    transition-[width] duration-300 ease-in-out
                    ${open ? "w-70" : "w-0"} `}
            >
                <SideBarLayout onToggle={() => setOpen((prev) => !prev)} />
            </aside>

            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-30"
                    onClick={() => setOpen(false)}
                />
            )}

            <div className={"min-h-screen bg-pink-50 flex flex-col"}>
                <MainHeader onToggle={() => setOpen((prev) => !prev)} />
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
            </div>
        </>
    );
};

export default Layout;
