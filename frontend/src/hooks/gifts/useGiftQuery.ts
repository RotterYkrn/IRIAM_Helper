import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import { giftKeys } from "../query-keys/gifts";

import { runEffectWithThrow } from "@/lib/utils";
import { GiftCategoryMappingRepository } from "@/repositories/gifts/gift-category-mapping.repository";
import { GiftCategoryRepository } from "@/repositories/gifts/gift-category.repository";
import { GiftRepository } from "@/repositories/gifts/gift.repository";


export const useGiftQuery = () => {
    const giftsQuery = useQuery({
        queryKey: giftKeys.lists(),
        queryFn: async () => {
            const result = await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftRepository;
                    return yield* repository.getAll();
                }),
            );
            return result;
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    const categoriesQuery = useQuery({
        queryKey: giftKeys.categories(),
        queryFn: async () => {
            const result = await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftCategoryRepository;
                    return yield* repository.getAll();
                }),
            );
            return result;
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    const mappingQuery = useQuery({
        queryKey: giftKeys.mappings(),
        queryFn: async () => {
            const result = await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftCategoryMappingRepository;
                    return yield* repository.getAll();
                }),
            );
            return result;
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    // 本来は Supabase からギフト＋所属カテゴリの配列を JOIN して取得する想定
    return {
        gifts: giftsQuery.data ?? Chunk.empty(),
        categories: categoriesQuery.data ?? Chunk.empty(),
        mappings: mappingQuery.data ?? Chunk.empty(),
        isLoading: false,
    };
};
