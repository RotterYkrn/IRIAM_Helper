import { useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { updateGiftCategoryEnduranceProjectQueryData } from "./utils";

import type { UpdateGiftCategoryEnduranceProjectArgs } from "@/domain/gift-category-endurances/rpcs/UpdateGiftCategoryEnduranceProject";
import { runEffectWithThrow } from "@/lib/utils";
import { GiftCategoryEnduranceRepository } from "@/repositories/gift-category-endurances/gift-category-endurance.repository";


/**
 * 耐久企画（単体）を新規作成するためのカスタムフック。
 *
 * @description
 * 成功時、企画一覧のキャッシュを無効化します。\
 * {@link ProjectKey.list}\
 *
 * @returns TanStack Query の Mutation オブジェクト。\
 * `mutate` 関数に {@link UpdateGiftCategoryEnduranceProjectArgs} を渡して実行します。
 */
export const useUpdateGiftCategoryEnduranceProject = () => {
    const mutation = useMutation({
        mutationFn: async (args: UpdateGiftCategoryEnduranceProjectArgs) =>
            await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftCategoryEnduranceRepository;
                    return yield* repository.update(args);
                }),
            ),
        onSuccess: (updatedProject, _vars, _onMutateResult, context) => {
            updateGiftCategoryEnduranceProjectQueryData(
                context.client,
                updatedProject,
            );
        },
    });

    return {
        update: mutation.mutate,
        isUpdating: mutation.isPending,
        updateError: mutation.error,
    };
};
