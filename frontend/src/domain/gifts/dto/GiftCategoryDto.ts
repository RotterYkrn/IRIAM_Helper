import { Schema } from "effect";

import { GiftCategoryId, GiftCategoryName } from "../tables/Categories";

import { withStrictNullCheck } from "@/utils/schema";

export const GiftCategoryDto = Schema.Struct({
    id: withStrictNullCheck(GiftCategoryId),
    name: withStrictNullCheck(GiftCategoryName),
});
export type GiftCategoryDto = typeof GiftCategoryDto.Type;
