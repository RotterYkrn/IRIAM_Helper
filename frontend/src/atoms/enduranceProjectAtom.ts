import { atomWithQuery } from "jotai-tanstack-query";

import { projectIdAtom } from "./projectIdAtom";

import { fetchEnduranceProject } from "@/use-cases/fetchEnduranceProject";

export const enduranceProjectAtom = atomWithQuery((get) => ({
    queryKey: ["enduranceProject", get(projectIdAtom)],
    queryFn: async () => {
        const projectId = get(projectIdAtom);
        if (!projectId) throw new Error("Project ID is required.");
        return await fetchEnduranceProject(projectId);
    },
}));
