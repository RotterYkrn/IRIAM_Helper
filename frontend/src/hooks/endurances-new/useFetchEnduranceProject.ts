import { keepPreviousData, useQueries } from "@tanstack/react-query";
import { Effect } from "effect";

import type { ProjectIdEncoded } from "@/domain/projects/tables/Project";
import { fetchEnduranceActionStatsNew } from "@/use-cases/endurances-new/fetchEnduranceActionStats";
import { fetchEnduranceProjectNew } from "@/use-cases/endurances-new/fetchEnduranceProject";

export const useFetchEnduranceProjectNew = (projectId: ProjectIdEncoded) => {
    return useQueries({
        queries: [
            {
                queryKey: ["project", projectId],
                queryFn: async () => {
                    try {
                        const result = await Effect.runPromise(
                            fetchEnduranceProjectNew(projectId),
                        );
                        return result;
                    } catch (error) {
                        console.error(error);
                        throw error;
                    }
                },
                placeholderData: keepPreviousData,
            },
            {
                queryKey: ["actionStats", projectId],
                queryFn: async () => {
                    try {
                        const result = await Effect.runPromise(
                            fetchEnduranceActionStatsNew(projectId),
                        );
                        return result;
                    } catch (error) {
                        console.error(error);
                        throw error;
                    }
                },
                placeholderData: keepPreviousData,
            },
        ],
    });
};
