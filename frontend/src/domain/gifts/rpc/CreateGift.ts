import { Schema } from "effect";
import { GiftCategoryId } from "../tables/Categories";
import { GiftName, GiftNickName, GiftPoint } from "../tables/Gifts";

export const CreateGiftArgs = Schema.Struct({
    name: GiftName,
    nick_name: GiftNickName,
    point: GiftPoint,
    category_ids: Schema.Chunk(GiftCategoryId),
});
export type CreateGiftArgs = typeof CreateGiftArgs.Type;
