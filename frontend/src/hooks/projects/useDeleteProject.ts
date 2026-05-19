import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import type { DeleteProjectArgs } from "@/domain/projects/rpcs/DeleteProject";
import { deleteProject } from "@/use-cases/projects/deleteProject";

/**
 * 企画を削除するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link DeleteProjectArgs} を渡して実行します。
 */
export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: DeleteProjectArgs) => {
            try {
                const result = await Effect.runPromise(deleteProject(args));
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (projectId) => {
            queryClient.setQueryData<Chunk.Chunk<typeof ProjectDtoSchema.Type>>(
                ProjectKey.list,
                (old) => old && Chunk.filter(old, (p) => p.id !== projectId),
            );
            queryClient.invalidateQueries({ queryKey: ProjectKey.list });
        },
    });

    return {
        delete: mutation.mutate,
        isDeleting: mutation.isPending,
        deleteError: mutation.error,
    };
};
