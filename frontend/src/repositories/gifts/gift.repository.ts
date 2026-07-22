import type { GiftDto, GiftDtoChunk } from "@/domain/gifts/dto/GiftDto";
import type { CreateGiftArgs } from "@/domain/gifts/rpc/CreateGift";
import type { UpdateGiftArgs } from "@/domain/gifts/rpc/UpdateGift";
import type { GiftId } from "@/domain/gifts/tables/Gifts";
import { Context, type Effect } from "effect";

export interface GiftRepository {
    readonly getAll: () => Effect.Effect<GiftDtoChunk, Error>;
    readonly create: (args: CreateGiftArgs) => Effect.Effect<GiftDto, Error>;
    readonly update: (args: UpdateGiftArgs) => Effect.Effect<GiftDto, Error>;
    readonly delete: (giftId: GiftId) => Effect.Effect<void, Error>;
}

export const GiftRepository = Context.GenericTag<GiftRepository>(
    "@repository/GiftRepository",
);
