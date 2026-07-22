import { GiftDto, GiftDtoChunk } from "@/domain/gifts/dto/GiftDto";
import { CreateGiftArgs } from "@/domain/gifts/rpc/CreateGift";
import { UpdateGiftArgs } from "@/domain/gifts/rpc/UpdateGift";
import { Effect, Either, Layer, pipe, Schema } from "effect";
import { GiftRepository } from "./gift.repository";

const gifts: {
    id: string;
    name: string;
    nick_name: string | null;
    point: number;
    category_ids: readonly number[];
}[] = [
    {
        id: crypto.randomUUID(),
        name: "ひらめいた！",
        nick_name: "ひらめき",
        point: 10,
        category_ids: [1, 2],
    },
    {
        id: crypto.randomUUID(),
        name: "いいね！",
        nick_name: null,
        point: 5,
        category_ids: [1],
    },
];

export const GiftSupabase = Layer.succeed(
    GiftRepository,
    GiftRepository.of({
        getAll: () =>
            // queryAndDecode(
            //     () => supabase.from("gifts_dto").select("*"),
            //     GiftsDtoChunk,
            // ),
            pipe(gifts, Schema.decodeEither(GiftDtoChunk)),
        create: (args) =>
            pipe(
                args,
                Schema.encodeEither(CreateGiftArgs),
                Either.map((encoded) => ({
                    id: crypto.randomUUID(),
                    ...encoded,
                })),
                Effect.tap((gift) => {
                    gifts.push(gift);
                }),
                Effect.flatMap(Schema.decodeEither(GiftDto)),
            ),
        update: (args) =>
            pipe(
                args,
                Schema.encodeEither(UpdateGiftArgs),
                Effect.flatMap((encoded) =>
                    Effect.gen(function* () {
                        const index = gifts.findIndex(
                            (gift) => gift.id === encoded.id,
                        );
                        if (index !== -1) {
                            gifts[index] = { ...gifts[index], ...encoded };
                            return gifts[index];
                        } else {
                            throw new Error("Gift not found");
                        }
                    }),
                ),
                Effect.flatMap(Schema.decodeEither(GiftDto)),
            ),
        delete: (giftId) =>
            pipe(
                Effect.gen(function* () {
                    const index = gifts.findIndex((gift) => gift.id === giftId);
                    if (index !== -1) {
                        gifts.splice(index, 1);
                    } else {
                        throw new Error("Gift not found");
                    }
                }),
            ),
    }),
);
