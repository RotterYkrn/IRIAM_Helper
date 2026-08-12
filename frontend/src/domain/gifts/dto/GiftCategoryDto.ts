import { withStrictNullCheck } from "@/utils/schema";
import { Schema } from "effect";
import { GiftCategoryId, GiftCategoryName } from "../tables/Categories";

export const GiftCategoryDto = Schema.Struct({
    id: withStrictNullCheck(GiftCategoryId),
    name: withStrictNullCheck(GiftCategoryName),
});
export type GiftCategoryDto = typeof GiftCategoryDto.Type;
