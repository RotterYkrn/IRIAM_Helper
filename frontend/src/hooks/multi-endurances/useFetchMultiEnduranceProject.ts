import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import { EnduranceKey } from "../query-keys/endurances";
import { ProjectKey } from "../query-keys/projects";

import type { ProjectId } from "@/domain/projects/tables/Project";
import { fetchMultiEnduranceProject } from "@/use-cases/multi-endurances/fetchMultiEnduranceProject";

export const useFetchMultiEnduranceProject = (projectId: ProjectId) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ProjectKey.detail(projectId),
        queryFn: async () => {
            try {
                const result = await Effect.runPromise(
                    fetchMultiEnduranceProject(projectId),
                );

                Chunk.map(result.units, (unit) => {
                    queryClient.setQueryData(EnduranceKey.unit(unit.id), unit);
                });

                return {
                    ...result,
                    units: Chunk.map(result.units, (unit) => unit.id),
                };
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};
