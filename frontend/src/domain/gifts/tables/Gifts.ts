import { Option, Schema } from "effect";

import type { Database } from "@/lib/database.types";

type GiftEncoded = Readonly<Database["public"]["Tables"]["gifts"]["Row"]>;

export const GiftId = Schema.UUID.pipe(Schema.brand("GiftId"));
export type GiftId = typeof GiftId.Type;

export const GiftName = Schema.String.pipe(
    Schema.minLength(1),
    Schema.brand("GiftName"),
);
export type GiftName = typeof GiftName.Type;

const BaseGiftNickName = Schema.String.pipe(
    Schema.minLength(1),
    Schema.brand("GiftNickName"),
);
type BaseGiftNickName = typeof BaseGiftNickName.Type;

export const GiftNickName = Schema.NullOr(BaseGiftNickName);
export type GiftNickName = typeof GiftNickName.Type;

export const GiftNickNameArg = Schema.optionalToRequired(
    BaseGiftNickName,
    Schema.NullOr(BaseGiftNickName),
    {
        decode: Option.getOrNull,
        encode: (nickNameOrNull) => {
            if (nickNameOrNull === null) {
                return Option.none();
            }
            return Option.some(BaseGiftNickName.make(nickNameOrNull));
        },
    },
);
export type GiftNickNameArg = GiftNickName;

export const GiftPoint = Schema.Positive.pipe(Schema.brand("GiftPoint"));
export type GiftPoint = typeof GiftPoint.Type;

export type Gift = Readonly<{
    id: GiftId;
    name: GiftName;
    nick_name: GiftNickName;
    point: GiftPoint;
}>;

export const Gift: Schema.Schema<Gift, GiftEncoded> = Schema.Struct({
    id: GiftId,
    name: GiftName,
    nick_name: GiftNickName,
    point: GiftPoint,
});

export const GiftChunk = Schema.Chunk(Gift);
export type GiftChunk = typeof GiftChunk.Type;
