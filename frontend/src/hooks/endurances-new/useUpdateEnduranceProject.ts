import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { UpdateEnduranceProjectNewArgs } from "@/domain/endurances-new/rpcs/UpdateEnduranceProjectNew";
import { updateEnduranceProjectNew } from "@/use-cases/endurances-new/updateEnduranceProject";

/**
 * 耐久企画（単体）を更新するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link UpdateEnduranceProjectNewArgs} を渡して実行します。
 */
export const useUpdateEnduranceProjectNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: UpdateEnduranceProjectNewArgs) => {
            try {
                const result = await Effect.runPromise(
                    updateEnduranceProjectNew(args),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (projectId) => {
            queryClient.invalidateQueries({
                queryKey: ProjectKey.detail(projectId),
            });
            queryClient.invalidateQueries({
                queryKey: ["actionStat", projectId],
            });
        },
    });
};
