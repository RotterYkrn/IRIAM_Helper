import { Chunk, Schema } from "effect";

import { GiftCategoryId } from "../tables/Categories";
import { GiftId, GiftName, GiftNickName, GiftPoint } from "../tables/Gifts";

import type { Database } from "@/lib/database.types";
import { withStrictNullCheck, type RecursiveReadonly } from "@/utils/schema";

type GiftDtoEncoded = RecursiveReadonly<
    Database["public"]["Views"]["gifts_dto"]["Row"]
>;

export type GiftDto = Readonly<{
    id: GiftId;
    name: GiftName;
    nick_name: GiftNickName;
    point: GiftPoint;
    category_ids: Chunk.Chunk<GiftCategoryId>;
}>;

export const GiftDto: Schema.Schema<GiftDto, GiftDtoEncoded> = Schema.Struct({
    id: withStrictNullCheck(GiftId),
    name: withStrictNullCheck(GiftName),
    nick_name: GiftNickName,
    point: withStrictNullCheck(GiftPoint),
    category_ids: withStrictNullCheck(Schema.Chunk(GiftCategoryId)),
});

export const GiftDtoChunk = Schema.Chunk(GiftDto);

export type GiftDtoChunk = typeof GiftDtoChunk.Type;
export type GiftDtoChunkEncoded = typeof GiftDtoChunk.Encoded;
