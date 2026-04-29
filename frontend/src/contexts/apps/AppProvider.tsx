import { useState } from "react";

import AppContext from "./AppContext";

type Props = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: Props) => {
    const [isOpenSideBar, setIsOpenSideBar] = useState(false);

    return (
        <AppContext value={{ isOpenSideBar, setIsOpenSideBar }}>
            {children}
        </AppContext>
    );
};
