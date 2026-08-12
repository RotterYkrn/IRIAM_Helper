import { Chunk, Schema } from "effect";

import { GiftCategoryId } from "../tables/Categories";
import { GiftName, GiftNickNameArg, GiftPoint } from "../tables/Gifts";

import type { Database } from "@/lib/database.types";
import { mapFrom, type RecursiveReadonly } from "@/utils/schema";

type CreateGiftArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["create_gift"]["Args"]
>;

export type CreateGiftArgs = Readonly<{
    name: GiftName;
    nick_name: GiftNickNameArg;
    point: GiftPoint;
    category_ids: Chunk.Chunk<GiftCategoryId>;
}>;

export const CreateGiftArgs: Schema.Schema<
    CreateGiftArgs,
    CreateGiftArgsEncoded
> = Schema.Struct({
    name: GiftName.pipe(mapFrom("p_name")),
    nick_name: GiftNickNameArg.pipe(Schema.fromKey("p_nick_name")),
    point: GiftPoint.pipe(mapFrom("p_point")),
    category_ids: Schema.Chunk(GiftCategoryId).pipe(mapFrom("p_category_ids")),
});
