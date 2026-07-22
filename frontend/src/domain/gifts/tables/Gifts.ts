import type { Database } from "@/lib/database.types";
import { Schema } from "effect";

type GiftEncoded = Readonly<Database["public"]["Tables"]["gifts"]["Row"]>;

export const GiftId = Schema.UUID.pipe(Schema.brand("GiftId"));
export type GiftId = typeof GiftId.Type;

export const GiftName = Schema.String.pipe(
    Schema.minLength(1),
    Schema.brand("GiftName"),
);
export type GiftName = typeof GiftName.Type;

export const GiftNickName = Schema.String.pipe(
    Schema.minLength(1),
    Schema.brand("GiftNickName"),
    Schema.NullOr,
);
export type GiftNickName = typeof GiftNickName.Type;

export const GiftPoint = Schema.Positive.pipe(Schema.brand("GiftPoint"));
export type GiftPoint = typeof GiftPoint.Type;

export type Gift = Readonly<{
    id: GiftId;
    name: GiftName;
    nick_name: GiftNickName;
    point: GiftPoint;
    created_at: Date;
    updated_at: Date;
}>;

export const Gift: Schema.Schema<Gift, GiftEncoded> = Schema.Struct({
    id: GiftId,
    name: GiftName,
    nick_name: GiftNickName,
    point: GiftPoint,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
