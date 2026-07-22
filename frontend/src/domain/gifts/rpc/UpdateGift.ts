import { Schema } from "effect";
import { GiftCategoryId } from "../tables/Categories";
import { GiftId, GiftName, GiftNickName, GiftPoint } from "../tables/Gifts";

export const UpdateGiftArgs = Schema.Struct({
    id: GiftId,
    name: GiftName,
    nick_name: GiftNickName,
    point: GiftPoint,
    category_ids: Schema.Chunk(GiftCategoryId),
});
export type UpdateGiftArgs = typeof UpdateGiftArgs.Type;
