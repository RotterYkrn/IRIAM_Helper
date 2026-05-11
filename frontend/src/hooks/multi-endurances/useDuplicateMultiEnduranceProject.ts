import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { DuplicateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/DuplicateMultiEnduranceProject";
import { duplicateMultiEnduranceProject } from "@/use-cases/multi-endurances/duplicateMultiEnduranceProject";

/**
 * 耐久企画（複数）を複製するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link DuplicateMultiEnduranceProjectArgs} を渡して実行します。
 */
export const useDuplicateMultiEnduranceProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: DuplicateMultiEnduranceProjectArgs) => {
            try {
                const result = await Effect.runPromise(
                    duplicateMultiEnduranceProject(args),
                );
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

    return {
        duplicate: mutation.mutate,
        isDuplicating: mutation.isPending,
        duplicateError: mutation.error,
    };
};
