import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Chunk } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { fetchProjectListOptions } from "./fetchProjectListOptions";

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
        ...fetchProjectListOptions,
        select: (projects) => ({
            scheduled: Chunk.filter(projects, (p) => p.status === "scheduled"),
            active: Chunk.filter(projects, (p) => p.status === "active"),
            finished: Chunk.filter(projects, (p) => p.status === "finished"),
        }),
        placeholderData: keepPreviousData,
    });
};
