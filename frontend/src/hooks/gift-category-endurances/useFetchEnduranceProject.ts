import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { EnduranceKey } from "../query-keys/endurances";
import { ProjectKey } from "../query-keys/projects";

import type { ProjectId } from "@/domain/projects/tables/Project";
import { runEffectWithThrow } from "@/lib/utils";
import { GiftCategoryEnduranceRepository } from "@/repositories/gift-category-endurances/gift-category-endurance.repository";

import { Effect } from "effect";
import { setGiftCategoryEnduranceProjectQueryData } from "./utils";

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
 * {@link fetchGiftCategoryEnduranceProject} を実行する
 */
export const useFetchGiftCategoryEnduranceProject = (projectId: ProjectId) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ProjectKey.detail(projectId),
        queryFn: async () => {
            const result = await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftCategoryEnduranceRepository;
                    return yield* repository.getById(projectId);
                }),
            );
            console.log(result.units.toJSON());
            return setGiftCategoryEnduranceProjectQueryData(
                queryClient,
                result,
            );
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
