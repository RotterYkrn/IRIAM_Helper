import { createContext } from "react";

type AppContextType = {
    isOpenSideBar: boolean;
    setIsOpenSideBar: (v: boolean) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;
