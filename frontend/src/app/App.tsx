import "../index.css";
import { useState } from "react";

import MainHeader from "./MainHeader";
import SideBar from "./SideBar";

const App = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <SideBar open={open} />

            <main
                className={` transition-[margin-left] duration-300 ease-in-out
                    ${open ? "ml-70" : "ml-0"} `}
            >
                <MainHeader onToggle={() => setOpen((prev) => !prev)} />

                <h1 className="text-xl font-bold">メインコンテンツ</h1>
            </main>
        </>
    );
};

export default App;
