import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { updateEnduranceProjectQueryData } from "./utils";

import type { DuplicateEnduranceProjectArgs } from "@/domain/endurances/rpcs/DuplicateEnduranceProject";
import { duplicateEnduranceProject } from "@/use-cases/endurances/duplicateEnduranceProject";

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
export const useDuplicateEnduranceProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
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
        onSuccess: (newProject) => {
            updateEnduranceProjectQueryData(queryClient, newProject);
        },
    });

    return {
        duplicate: mutation.mutate,
        isDuplicating: mutation.isPending,
        duplicateError: mutation.error,
    };
};
