import { useContext } from "react";

import AppRuntimeContext from "./AppRuntimeContext";

export const useAppRuntimeContext = () => {
    const ctx = useContext(AppRuntimeContext);
    if (!ctx) {
        throw new Error("App components must be used within AppEffectContext");
    }
    return ctx;
};
