import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { ActivateProjectArgsEncoded } from "@/domain/projects/rpcs/ActivateProject";
import { activateProject } from "@/use-cases/projects/activateProject";

/**
 * 企画を開催状態にするためのカスタムフック。
 *
 * @description
 * 成功時、開始したプロジェクトと企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 * {@link ProjectKey.detail}
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link ActivateProjectArgsEncoded} を渡して実行します。
 */
export const useActivateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: ActivateProjectArgsEncoded) => {
            try {
                const result = await Effect.runPromise(activateProject(args));
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (projectId) => {
            queryClient.invalidateQueries({ queryKey: ProjectKey.list });
            queryClient.invalidateQueries({
                queryKey: ProjectKey.detail(projectId),
            });
        },
    });
};
