import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ProjectKey } from "../query-keys/projects";

import { updateEnduranceProjectQueryData } from "./utils";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import type { DuplicateEnduranceProjectArgs } from "@/domain/endurances/rpcs/DuplicateEnduranceProject";
import { runEffectWithThrow } from "@/lib/utils";
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
    const runtime = useAppRuntimeContext();

    const mutation = useMutation({
        mutationFn: async (args: DuplicateEnduranceProjectArgs) =>
            await runEffectWithThrow(runtime)(duplicateEnduranceProject(args)),
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
