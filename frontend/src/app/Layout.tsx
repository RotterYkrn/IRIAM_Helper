import { useState } from "react";
import { Outlet } from "react-router-dom";

import MainHeader from "./MainHeader";
import SideBar from "./SideBar";

const Layout = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <SideBar
                open={open}
                onToggle={() => setOpen((prev) => !prev)}
            />

            <div
                className={`min-h-screen bg-pink-50 transition-[margin-left]
                    duration-300 ease-in-out ${open ? "ml-70" : "ml-0"} flex
                    flex-col`}
            >
                <MainHeader onToggle={() => setOpen((prev) => !prev)} />
                <main
                    className="flex-1 p-4 md:p-8 flex justify-center
                        items-start"
                >
                    <div
                        className="w-full max-w-4xl bg-white rounded-xl border
                            border-slate-200 shadow-sm p-6"
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
};

export default Layout;
