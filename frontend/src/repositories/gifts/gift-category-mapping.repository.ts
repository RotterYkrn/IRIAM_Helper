import type { GiftCategoryMappingChunk } from "@/domain/gifts/tables/GiftCategoryMappings";
import { Context, Effect } from "effect";

export interface GiftCategoryMappingRepository {
    readonly getAll: () => Effect.Effect<GiftCategoryMappingChunk, Error>;
}

export const GiftCategoryMappingRepository =
    Context.GenericTag<GiftCategoryMappingRepository>(
        "@repository/GiftCategoryMappingRepository",
    );
