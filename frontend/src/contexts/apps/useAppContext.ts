import { useContext } from "react";

import AppContext from "./AppContext";

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("App components must be used within AppContext");
    }
    return ctx;
};
