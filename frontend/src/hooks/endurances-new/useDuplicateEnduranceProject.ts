import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { DuplicateEnduranceProjectArgs } from "@/domain/endurances-new/rpcs/DuplicateEnduranceProject";
import { duplicateEnduranceProject } from "@/use-cases/endurances-new/duplicateEnduranceProject";

/**
 * 耐久企画（単体）を複製するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link DuplicateEnduranceProjectArgs} を渡して実行します。
 */
export const useDuplicateEnduranceProjectNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: DuplicateEnduranceProjectArgs) => {
            try {
                const result = await Effect.runPromise(
                    duplicateEnduranceProject(args),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
