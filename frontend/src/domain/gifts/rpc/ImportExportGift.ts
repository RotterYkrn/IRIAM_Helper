import type { Database } from "@/lib/database.types";
import { mapFrom, type RecursiveReadonly } from "@/utils/schema";
import { Schema } from "effect";
import { GiftCategoryChunk } from "../tables/Categories";
import { GiftCategoryMappingChunk } from "../tables/GiftCategoryMappings";
import { GiftChunk } from "../tables/Gifts";

type ImportExportGiftArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["import_gift_data"]["Args"]
>;

export type ImportExportGiftArgs = Readonly<{
    gifts: GiftChunk;
    categories: GiftCategoryChunk;
    mappings: GiftCategoryMappingChunk;
}>;

export const ImportExportGiftArgs: Schema.Schema<
    ImportExportGiftArgs,
    ImportExportGiftArgsEncoded
> = Schema.Struct({
    gifts: GiftChunk.pipe(mapFrom("p_gifts")),
    categories: GiftCategoryChunk.pipe(mapFrom("p_categories")),
    mappings: GiftCategoryMappingChunk.pipe(mapFrom("p_mappings")),
});
