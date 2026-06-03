import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { ProjectKey } from "../query-keys/projects";

import { setMultiEnduranceProjectQueryData } from "./utils";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import type { ProjectId } from "@/domain/projects/tables/Project";
import { runEffectWithThrow } from "@/lib/utils";
import { fetchMultiEnduranceProject } from "@/use-cases/multi-endurances/fetchMultiEnduranceProject";

export const useFetchMultiEnduranceProject = (projectId: ProjectId) => {
    const queryClient = useQueryClient();
    const runtime = useAppRuntimeContext();

    const query = useQuery({
        queryKey: ProjectKey.detail(projectId),
        queryFn: async () => {
            const result = await runEffectWithThrow(runtime)(
                fetchMultiEnduranceProject(projectId),
            );
            return setMultiEnduranceProjectQueryData(queryClient, result);
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
