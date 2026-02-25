import {
    keepPreviousData,
    useQueries,
    useQueryClient,
} from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import type { ProjectIdEncoded } from "@/domain/projects/tables/Project";
import { fetchEnduranceActionStatsNew } from "@/use-cases/endurances-new/fetchEnduranceActionStats";
import { fetchEnduranceProjectNew } from "@/use-cases/endurances-new/fetchEnduranceProject";

export const useFetchEnduranceProjectNew = (projectId: ProjectIdEncoded) => {
    const queryClient = useQueryClient();

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
                staleTime: 5 * 60 * 1000,
                placeholderData: keepPreviousData,
            },
            {
                queryKey: ["actionStat", projectId],
                queryFn: async () => {
                    try {
                        const result = await Effect.runPromise(
                            fetchEnduranceActionStatsNew(projectId),
                        );

                        Chunk.map(result.rescue_actions, (action) => {
                            queryClient.setQueryData(
                                ["action", action.id],
                                action,
                            );
                        });

                        Chunk.map(result.sabotage_actions, (action) => {
                            queryClient.setQueryData(
                                ["action", action.id],
                                action,
                            );
                        });

                        return {
                            ...result,
                            rescue_actions: Chunk.map(
                                result.rescue_actions,
                                (action) => action.id,
                            ),
                            sabotage_actions: Chunk.map(
                                result.sabotage_actions,
                                (action) => action.id,
                            ),
                        };
                    } catch (error) {
                        console.error(error);
                        throw error;
                    }
                },
                staleTime: 5 * 60 * 1000,
                placeholderData: keepPreviousData,
            },
        ],
    });
};
