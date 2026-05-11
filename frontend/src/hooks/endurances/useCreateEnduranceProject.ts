import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { CreateEnduranceProjectArgs } from "@/domain/endurances/rpcs/CreateEnduranceProject";
import { createEnduranceProject } from "@/use-cases/endurances/createEnduranceProject";

/**
 * 耐久企画（単体）を新規作成するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link CreateEnduranceProjectArgs} を渡して実行します。
 */
export const useCreateEnduranceProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: CreateEnduranceProjectArgs) => {
            try {
                const result = await Effect.runPromise(
                    createEnduranceProject(args),
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
        create: mutation.mutate,
        isCreating: mutation.isPending,
        createError: mutation.error,
    };
};
