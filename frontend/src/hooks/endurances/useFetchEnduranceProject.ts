import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { EnduranceKey } from "../query-keys/endurances";
import { ProjectKey } from "../query-keys/projects";

import { setEnduranceProjectQueryData } from "./utils";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import type { ProjectId } from "@/domain/projects/tables/Project";
import { runEffectWithThrow } from "@/lib/utils";
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
export const useFetchEnduranceProject = (projectId: ProjectId) => {
    const queryClient = useQueryClient();
    const runtime = useAppRuntimeContext();

    const query = useQuery({
        queryKey: ProjectKey.detail(projectId),
        queryFn: async () => {
            const result = await runEffectWithThrow(runtime)(
                fetchEnduranceProject(projectId),
            );
            return setEnduranceProjectQueryData(queryClient, result);
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
