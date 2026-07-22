import type { Database } from "@/lib/database.types";
import { Schema } from "effect";

type GiftCategoryEncoded = Readonly<
    Database["public"]["Tables"]["gift_categories"]["Row"]
>;

export const GiftCategoryId = Schema.Int.pipe(Schema.brand("GiftCategoryId"));
export type GiftCategoryId = typeof GiftCategoryId.Type;

export const GiftCategoryName = Schema.String.pipe(
    Schema.minLength(1),
    Schema.brand("GiftCategoryName"),
);
export type GiftCategoryName = typeof GiftCategoryName.Type;

export type GiftCategory = Readonly<{
    id: typeof GiftCategoryId.Type;
    name: typeof GiftCategoryName.Type;
}>;

export const GiftCategory: Schema.Schema<GiftCategory, GiftCategoryEncoded> =
    Schema.Struct({
        id: GiftCategoryId,
        name: GiftCategoryName,
    });

export const GiftCategoryChunk = Schema.Chunk(GiftCategory);
export type GiftCategoryChunk = typeof GiftCategoryChunk.Type;
