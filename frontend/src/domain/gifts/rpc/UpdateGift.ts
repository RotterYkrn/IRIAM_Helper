import type { Database } from "@/lib/database.types";
import { mapFrom, type RecursiveReadonly } from "@/utils/schema";
import { Schema } from "effect";
import { GiftCategoryId } from "../tables/Categories";
import { GiftId, GiftName, GiftNickNameArg, GiftPoint } from "../tables/Gifts";

type UpdateGiftArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["update_gift"]["Args"]
>;

export const UpdateGiftArgs: Schema.Schema<any, UpdateGiftArgsEncoded> =
    Schema.Struct({
        id: GiftId.pipe(mapFrom("p_gift_id")),
        name: GiftName.pipe(mapFrom("p_name")),
        nick_name: GiftNickNameArg.pipe(Schema.fromKey("p_nick_name")),
        point: GiftPoint.pipe(mapFrom("p_point")),
        category_ids: Schema.Chunk(GiftCategoryId).pipe(
            mapFrom("p_category_ids"),
        ),
    });
export type UpdateGiftArgs = typeof UpdateGiftArgs.Type;
