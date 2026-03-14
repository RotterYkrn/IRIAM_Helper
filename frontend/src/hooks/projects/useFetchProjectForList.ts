import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { fetchProjects } from "@/use-cases/projects/fetchProjects";

/**
 * 企画一覧を取得するためのカスタムフック。
 *
 * @description
 * - QueryKey: {@link ProjectKey.list}\
 * - キャッシュの有効期限(staleTime): デフォルト（0）
 *
 * @returns TanStack Query の Query オブジェクト\
 * {@link fetchProjects} を実行する
 *
 */
export const useFetchProjectForList = () => {
    return useQuery({
        queryKey: ProjectKey.list,
        queryFn: async () => {
            try {
                return await Effect.runPromise(fetchProjects());
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        select: (projects) => ({
            scheduled: Chunk.filter(projects, (p) => p.status === "scheduled"),
            active: Chunk.filter(projects, (p) => p.status === "active"),
            finished: Chunk.filter(projects, (p) => p.status === "finished"),
        }),
        placeholderData: keepPreviousData,
    });
};
