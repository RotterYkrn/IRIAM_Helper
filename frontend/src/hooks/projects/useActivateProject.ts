import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import type { ActivateProjectArgs } from "@/domain/projects/rpcs/ActivateProject";
import { activateProject } from "@/use-cases/projects/activateProject";

/**
 * 企画を開催状態にするためのカスタムフック。
 *
 * @description
 * 成功時、開始したプロジェクトと企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 * {@link ProjectKey.detail}
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link ActivateProjectArgs} を渡して実行します。
 */
export const useActivateProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: ActivateProjectArgs) => {
            try {
                const result = await Effect.runPromise(activateProject(args));
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (projectId) => {
            // 一覧のリストグループにも影響するため、一覧も更新
            queryClient.setQueryData<Chunk.Chunk<typeof ProjectDtoSchema.Type>>(
                ProjectKey.list,
                (old) =>
                    old &&
                    Chunk.map(old, (p) =>
                        p.id === projectId ? { ...p, status: "active" } : p,
                    ),
            );
            queryClient.setQueryData<typeof ProjectDtoSchema.Type>(
                ProjectKey.detail(projectId),
                (old) => old && { ...old, status: "active" },
            );
            queryClient.invalidateQueries({ queryKey: ProjectKey.list });
            queryClient.invalidateQueries({
                queryKey: ProjectKey.detail(projectId),
            });
        },
    });

    return {
        activate: mutation.mutate,
        isActivating: mutation.isPending,
        activateError: mutation.error,
    };
};
