import { useQuery } from "@tanstack/react-query";

import { fetchProject } from "@/use-cases/fetchProject";

export const useProject = (projectId: string) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => fetchProject(projectId),
        enabled: !!projectId,
    });
};
