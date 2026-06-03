import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Chunk } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import type { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import type { FinishProjectArgs } from "@/domain/projects/rpcs/FinishProject";
import { runEffectWithThrow } from "@/lib/utils";
import { finishProject } from "@/use-cases/projects/finishProject";

/**
 * 企画を終了状態にするためのカスタムフック。
 *
 * @description
 * 成功時、開始したプロジェクトと企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 * {@link ProjectKey.detail}
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link FinishProjectArgs} を渡して実行します。
 */
export const useFinishProject = () => {
    const queryClient = useQueryClient();
    const runtime = useAppRuntimeContext();

    const mutation = useMutation({
        mutationFn: async (args: FinishProjectArgs) =>
            await runEffectWithThrow(runtime)(finishProject(args)),
        onSuccess: (projectId) => {
            // 一覧のリストグループにも影響するため、一覧も更新
            queryClient.setQueryData<Chunk.Chunk<typeof ProjectDtoSchema.Type>>(
                ProjectKey.list,
                (old) =>
                    old &&
                    Chunk.map(old, (p) =>
                        p.id === projectId ? { ...p, status: "finished" } : p,
                    ),
            );
            queryClient.setQueryData<typeof ProjectDtoSchema.Type>(
                ProjectKey.detail(projectId),
                (old) => old && { ...old, status: "finished" },
            );
            queryClient.invalidateQueries({ queryKey: ProjectKey.list });
            queryClient.invalidateQueries({
                queryKey: ProjectKey.detail(projectId),
            });
        },
    });

    return {
        finish: mutation.mutate,
        isFinishing: mutation.isPending,
        finishError: mutation.error,
    };
};
