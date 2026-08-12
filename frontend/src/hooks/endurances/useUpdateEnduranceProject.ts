import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ProjectKey } from "../query-keys/projects";

import { updateEnduranceProjectQueryData } from "./utils";

import type { UpdateEnduranceProjectArgs } from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import { runEffectWithThrow } from "@/lib/utils";
import { updateEnduranceProject } from "@/use-cases/endurances/updateEnduranceProject";

/**
 * 耐久企画（単体）を更新するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link UpdateEnduranceProjectArgs} を渡して実行します。
 */
export const useUpdateEnduranceProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: UpdateEnduranceProjectArgs) =>
            await runEffectWithThrow(updateEnduranceProject(args)),
        onSuccess: (updatedProject) => {
            updateEnduranceProjectQueryData(queryClient, updatedProject);
        },
    });

    return {
        update: mutation.mutate,
        isUpdating: mutation.isPending,
        updateError: mutation.error,
    };
};
