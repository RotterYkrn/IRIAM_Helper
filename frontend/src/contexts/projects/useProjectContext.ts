import { useContext } from "react";

import ProjectContext from "./ProjectContext";

export const useProjectContext = () => {
    const ctx = useContext(ProjectContext);
    if (!ctx) {
        throw new Error(
            "Project components must be used within ProjectContext",
        );
    }
    return ctx;
};
