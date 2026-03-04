import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { fetchProjectsByStatus } from "@/use-cases/projects/fetchProjectByStatus";

/**
 * 企画一覧を取得するためのカスタムフック。
 *
 * @description
 * - QueryKey: {@link ProjectKey.list}\
 * - キャッシュの有効期限(staleTime): デフォルト（0）
 *
 * @returns TanStack Query の Query オブジェクト\
 * {@link fetchProjectsByStatus} を実行する
 *
 */
export const useFetchProjectForSideBar = () => {
    return useQuery({
        queryKey: ProjectKey.list,
        queryFn: async () => {
            try {
                return await Effect.runPromise(fetchProjectsByStatus());
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        placeholderData: keepPreviousData,
    });
};
