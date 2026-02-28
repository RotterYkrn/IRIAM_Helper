import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { CreateEnduranceProjectNewArgs } from "@/domain/endurances-new/rpcs/CreateEnduranceProjectNew";
import { createEnduranceProjectNew } from "@/use-cases/endurances-new/createEnduranceProject";

/**
 * 耐久企画（単体）を新規作成するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link CreateEnduranceProjectNewArgs} を渡して実行します。
 */
export const useCreateEnduranceProjectNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: CreateEnduranceProjectNewArgs) => {
            try {
                const result = await Effect.runPromise(
                    createEnduranceProjectNew(args),
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
