import {
    keepPreviousData,
    useQueries,
    useQueryClient,
} from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import { EnduranceKey } from "../query-keys/endurances";
import { ProjectKey } from "../query-keys/projects";

import type { ProjectIdEncoded } from "@/domain/projects/tables/Project";
import { fetchEnduranceActionStatsNew } from "@/use-cases/endurances-new/fetchEnduranceActionStats";
import { fetchEnduranceProjectNew } from "@/use-cases/endurances-new/fetchEnduranceProject";

/**
 * 耐久企画の情報を取得するためのカスタムフック。
 *
 * @description
 * - QueryKey
 *   - {@link ProjectKey.detail} 耐久企画の情報
 *   - {@link EnduranceKey.actionStat} 救済・妨害アクションのIDの配列
 *   - {@link EnduranceKey.action} 救済・妨害アクションの各情報
 * - キャッシュの有効期限(staleTime): 5分
 *
 * @returns TanStack Query の Query オブジェクトの配列\
 * [{@link fetchEnduranceProjectNew}, {@link fetchEnduranceActionStatsNew}] を実行する
 *
 */
export const useFetchEnduranceProjectNew = (projectId: ProjectIdEncoded) => {
    const queryClient = useQueryClient();

    return useQueries({
        queries: [
            {
                queryKey: ProjectKey.detail(projectId),
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
                queryKey: EnduranceKey.actionStat,
                queryFn: async () => {
                    try {
                        const result = await Effect.runPromise(
                            fetchEnduranceActionStatsNew(projectId),
                        );

                        Chunk.map(result.rescue_actions, (action) => {
                            queryClient.setQueryData(
                                EnduranceKey.action(action.id),
                                action,
                            );
                        });

                        Chunk.map(result.sabotage_actions, (action) => {
                            queryClient.setQueryData(
                                EnduranceKey.action(action.id),
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
