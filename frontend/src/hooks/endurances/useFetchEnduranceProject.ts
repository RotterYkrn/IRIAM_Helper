import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Effect } from "effect";

import type { ProjectIdEncoded } from "@/domain/projects/tables/Project";
import { fetchEnduranceProject } from "@/use-cases/endurances/fetchEnduranceProject";

export const useFetchEnduranceData = (projectId: ProjectIdEncoded) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            try {
                const result = await Effect.runPromise(
                    fetchEnduranceProject(projectId),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        placeholderData: keepPreviousData,
    });
};
