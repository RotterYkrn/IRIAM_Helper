import { atomWithQuery } from "jotai-tanstack-query";

import { fetchEnduranceProject } from "@/use-cases/fetchEnduranceProject";

export const enduranceProjectAtom = (projectId: string) =>
    atomWithQuery(() => ({
        queryKey: ["enduranceProject", projectId],
        queryFn: () => fetchEnduranceProject(projectId),
    }));
