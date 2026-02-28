import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { DeleteProjectArgsEncoded } from "@/domain/projects/rpcs/DeleteProject";
import { deleteProject } from "@/use-cases/projects/deleteProject";

/**
 * 企画を削除するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link DeleteProjectArgsEncoded} を渡して実行します。
 */
export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: DeleteProjectArgsEncoded) => {
            try {
                const result = await Effect.runPromise(deleteProject(args));
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ProjectKey.list });
        },
    });
};
