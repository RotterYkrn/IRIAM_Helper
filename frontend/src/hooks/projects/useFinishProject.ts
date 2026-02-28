import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { FinishProjectArgsEncoded } from "@/domain/projects/rpcs/FinishProject";
import { finishProject } from "@/use-cases/projects/finishProject";

/**
 * 企画を終了状態にするためのカスタムフック。
 *
 * @description
 * 成功時、開始したプロジェクトと企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 * {@link ProjectKey.detail}
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link ActivateProjectArgsEncoded} を渡して実行します。
 */
export const useFinishProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: FinishProjectArgsEncoded) => {
            try {
                const result = await Effect.runPromise(finishProject(args));
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
