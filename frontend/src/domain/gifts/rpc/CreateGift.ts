import type { Database } from "@/lib/database.types";
import { mapFrom, type RecursiveReadonly } from "@/utils/schema";
import { Schema } from "effect";
import { GiftCategoryId } from "../tables/Categories";
import { GiftName, GiftNickNameArg, GiftPoint } from "../tables/Gifts";

type CreateGiftArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["create_gift"]["Args"]
>;

export const CreateGiftArgs: Schema.Schema<any, CreateGiftArgsEncoded> =
    Schema.Struct({
        name: GiftName.pipe(mapFrom("p_name")),
        nick_name: GiftNickNameArg.pipe(Schema.fromKey("p_nick_name")),
        point: GiftPoint.pipe(mapFrom("p_point")),
        category_ids: Schema.Chunk(GiftCategoryId).pipe(
            mapFrom("p_category_ids"),
        ),
    });
export type CreateGiftArgs = typeof CreateGiftArgs.Type;
