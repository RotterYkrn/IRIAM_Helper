import { useQueries } from "@tanstack/react-query";

import { fetchEnduranceProgress } from "@/use-cases/fetchEnduranceProgress";
import { fetchEnduranceSettings } from "@/use-cases/fetchEnduranceSettings";
import { fetchProject } from "@/use-cases/fetchProject";

export const useEnduranceData = (projectId: string) => {
    return useQueries({
        queries: [
            {
                queryKey: ["project", projectId],
                queryFn: () => fetchProject(projectId),
            },
            {
                queryKey: ["enduranceSettings", projectId],
                queryFn: () => fetchEnduranceSettings(projectId),
            },
            {
                queryKey: ["enduranceProgress", projectId],
                queryFn: () => fetchEnduranceProgress(projectId),
            },
        ],
    });
};
