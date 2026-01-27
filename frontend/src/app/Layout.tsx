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
                className={`transition-[margin-left] duration-300 ease-in-out
                    ${open ? "ml-70" : "ml-0"}`}
            >
                <MainHeader onToggle={() => setOpen((prev) => !prev)} />
                <main className="flex p-4 justify-center">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default Layout;
