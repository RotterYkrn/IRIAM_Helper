import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { DuplicateGiftCategoryEnduranceProjectArgs } from "@/domain/gift-category-endurances/rpcs/DuplicateMultiEnduranceProject";
import { runEffectWithThrow } from "@/lib/utils";
import { GiftCategoryEnduranceRepository } from "@/repositories/gift-category-endurances/gift-category-endurance.repository";
import { Effect } from "effect";
import { ProjectKey } from "../query-keys/projects";
import { updateGiftCategoryEnduranceProjectQueryData } from "./utils";

/**
 * 耐久企画（複数）を複製するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link DuplicateGiftCategoryEnduranceProjectArgs} を渡して実行します。
 */
export const useDuplicateGiftCategoryEnduranceProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: DuplicateGiftCategoryEnduranceProjectArgs) =>
            await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftCategoryEnduranceRepository;
                    return yield* repository.duplicate(args);
                }),
            ),
        onSuccess: (newProject) => {
            updateGiftCategoryEnduranceProjectQueryData(
                queryClient,
                newProject,
            );
        },
    });

    return {
        duplicate: mutation.mutate,
        isDuplicating: mutation.isPending,
        duplicateError: mutation.error,
    };
};
