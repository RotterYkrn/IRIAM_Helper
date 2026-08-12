import { useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { updateGiftCategoryEnduranceProjectQueryData } from "./utils";

import type { CreateGiftCategoryEnduranceProjectArgs } from "@/domain/gift-category-endurances/rpcs/CreateGiftCategoryEnduranceProject";
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
 * `mutate` 関数に {@link CreateGiftCategoryEnduranceProjectArgs} を渡して実行します。
 */
export const useCreateGiftCategoryEnduranceProject = () => {
    const mutation = useMutation({
        mutationFn: async (args: CreateGiftCategoryEnduranceProjectArgs) =>
            await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftCategoryEnduranceRepository;
                    return yield* repository.create(args);
                }),
            ),
        onSuccess: (createdProject, _vars, _onMutateResult, context) => {
            updateGiftCategoryEnduranceProjectQueryData(
                context.client,
                createdProject,
            );
        },
    });

    return {
        create: mutation.mutate,
        isCreating: mutation.isPending,
        createError: mutation.error,
    };
};
