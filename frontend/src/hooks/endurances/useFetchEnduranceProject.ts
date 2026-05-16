import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import { EnduranceKey } from "../query-keys/endurances";
import { ProjectKey } from "../query-keys/projects";

import type { EnduranceProjectDto } from "@/domain/endurances/dto/EnduranceProjectDto";
import type { ProjectIdEncoded } from "@/domain/projects/tables/Project";
import { fetchEnduranceProject } from "@/use-cases/endurances/fetchEnduranceProject";

/**
 * 耐久企画の情報を取得するためのカスタムフック。
 *
 * @description
 * - QueryKey
 *   - {@link ProjectKey.detail} 耐久企画の情報
 *   - {@link EnduranceKey.action} 救済・妨害アクションの各情報
 * - キャッシュの有効期限(staleTime): 5分
 *
 * @returns TanStack Query の Query オブジェクトの配列\
 * {@link fetchEnduranceProject} を実行する
 */
export const useFetchEnduranceProject = (projectId: ProjectIdEncoded) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ProjectKey.detail(projectId),
        queryFn: async () => {
            try {
                const result = await Effect.runPromise(
                    fetchEnduranceProject(projectId),
                );
                return setEnduranceProjectQueryData(queryClient, result);
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
        fetchError: query.error,
        isFetching: query.isLoading,
    };
};

export const setEnduranceProjectQueryData = (
    queryClient: ReturnType<typeof useQueryClient>,
    project: EnduranceProjectDto,
) => {
    Chunk.map(project.rescue_actions, (action) => {
        queryClient.setQueryData(EnduranceKey.action(action.id), action);
    });
    Chunk.map(project.sabotage_actions, (action) => {
        queryClient.setQueryData(EnduranceKey.action(action.id), action);
    });

    return {
        ...project,
        rescue_actions: Chunk.map(
            project.rescue_actions,
            (action) => action.id,
        ),
        sabotage_actions: Chunk.map(
            project.sabotage_actions,
            (action) => action.id,
        ),
    };
};
