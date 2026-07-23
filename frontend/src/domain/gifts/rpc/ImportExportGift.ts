import { pipe, Schema } from "effect";
import { GiftCategoryChunk } from "../tables/Categories";
import { GiftCategoryMappingChunk } from "../tables/GiftCategoryMappings";
import { Gift } from "../tables/Gifts";

export const ImportExportGiftArgs = Schema.Struct({
    gifts: pipe(Gift, Schema.omit("created_at", "updated_at"), Schema.Chunk),
    categories: GiftCategoryChunk,
    mappings: GiftCategoryMappingChunk,
});
export type ImportExportGiftArgs = typeof ImportExportGiftArgs.Type;
