import { useQuery } from "@tanstack/react-query";

import { fetchEnduranceProject } from "@/use-cases/fetchEnduranceProject";

export const useFetchEnduranceData = (projectId: string) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => fetchEnduranceProject(projectId),
    });
};
