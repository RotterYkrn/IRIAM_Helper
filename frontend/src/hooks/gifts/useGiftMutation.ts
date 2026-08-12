import type { CreateGiftArgs } from "@/domain/gifts/rpc/CreateGift";
import { ImportExportGiftArgs } from "@/domain/gifts/rpc/ImportExportGift";
import type { UpdateGiftArgs } from "@/domain/gifts/rpc/UpdateGift";
import type {
    GiftCategoryId,
    GiftCategoryName,
} from "@/domain/gifts/tables/Categories";
import type { GiftId } from "@/domain/gifts/tables/Gifts";
import { runEffectWithThrow } from "@/lib/utils";
import { GiftCategoryRepository } from "@/repositories/gifts/gift-category.repository";
import { GiftRepository } from "@/repositories/gifts/gift.repository";
import { useMutation } from "@tanstack/react-query";
import { Effect, pipe, Schema } from "effect";
import { giftKeys } from "../query-keys/gifts";

export const useGiftMutation = () => {
    return {
        createGift: useMutation({
            mutationFn: async (args: CreateGiftArgs) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftRepository;
                        return yield* repository.create(args);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Create Gift", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.lists(),
                });
            },
        }),
        updateGift: useMutation({
            mutationFn: async (args: UpdateGiftArgs) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftRepository;
                        return yield* repository.update(args);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Update Gift", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.lists(),
                });
            },
        }),
        deleteGift: useMutation({
            mutationFn: async (id: GiftId) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftRepository;
                        return yield* repository.delete(id);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Delete Gift", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.lists(),
                });
            },
        }),
        createCategory: useMutation({
            mutationFn: async (name: GiftCategoryName) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftCategoryRepository;
                        return yield* repository.create(name);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Create Category", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.categories(),
                });
            },
        }),
        updateCategory: useMutation({
            mutationFn: async ({
                id,
                name,
            }: {
                id: GiftCategoryId;
                name: GiftCategoryName;
            }) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftCategoryRepository;
                        return yield* repository.update(id, name);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Update Category", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.categories(),
                });
            },
        }),
        deleteCategory: useMutation({
            mutationFn: async (id: GiftCategoryId) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftCategoryRepository;
                        return yield* repository.delete(id);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Delete Category", data);
                context.client.invalidateQueries({ queryKey: giftKeys.all });
            },
        }),
        exportData: useMutation({
            mutationFn: async (args: ImportExportGiftArgs) => {
                const backupData = pipe(
                    args,
                    Schema.encodeSync(ImportExportGiftArgs),
                );
                console.log("Backup Data", backupData);

                const blob = new Blob([JSON.stringify(backupData, null, 2)], {
                    type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `iriam_gifts_raw_backup_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                a.remove();
            },
            onMutate: (_vars, context) => {
                context.client.invalidateQueries({ queryKey: giftKeys.all });
            },
        }),
        importData: useMutation({
            mutationFn: async (args: ImportExportGiftArgs) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftRepository;
                        return yield* repository.import(args);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Import Data", data);
                context.client.invalidateQueries({ queryKey: giftKeys.all });
            },
        }),
    };
};
