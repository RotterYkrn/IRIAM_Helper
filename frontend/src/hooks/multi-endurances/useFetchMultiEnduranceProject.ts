import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { setMultiEnduranceProjectQueryData } from "./utils";

import type { ProjectId } from "@/domain/projects/tables/Project";
import { fetchMultiEnduranceProject } from "@/use-cases/multi-endurances/fetchMultiEnduranceProject";

export const useFetchMultiEnduranceProject = (projectId: ProjectId) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ProjectKey.detail(projectId),
        queryFn: async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const result = await Effect.runPromise(
                    fetchMultiEnduranceProject(projectId),
                );
                return setMultiEnduranceProjectQueryData(queryClient, result);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    return {
        data: query.data,
        isFetching: query.isLoading,
        fetchError: query.error,
    };
};
