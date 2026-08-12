import { Schema } from "effect";

import { GiftCategoryId } from "./Categories";
import { GiftId } from "./Gifts";

import type { Database } from "@/lib/database.types";

type GiftCategoryMappingEncoded = Readonly<
    Database["public"]["Tables"]["gift_category_mappings"]["Row"]
>;

export type GiftCategoryMapping = Readonly<{
    gift_id: GiftId;
    category_id: GiftCategoryId;
}>;

export const GiftCategoryMapping: Schema.Schema<
    GiftCategoryMapping,
    GiftCategoryMappingEncoded
> = Schema.Struct({
    gift_id: GiftId,
    category_id: GiftCategoryId,
});

export const GiftCategoryMappingChunk = Schema.Chunk(GiftCategoryMapping);
export type GiftCategoryMappingChunk = typeof GiftCategoryMappingChunk.Type;
