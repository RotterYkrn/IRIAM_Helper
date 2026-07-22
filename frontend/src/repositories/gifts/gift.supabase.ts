import { GiftDtoChunk } from "@/domain/gifts/dto/GiftDto";
import { CreateGiftArgs } from "@/domain/gifts/rpc/CreateGift";
import { UpdateGiftArgs } from "@/domain/gifts/rpc/UpdateGift";
import { GiftId } from "@/domain/gifts/tables/Gifts";
import { supabase } from "@/lib/supabase";
import { queryAndDecode } from "@/utils/api";
import { Layer, Schema } from "effect";
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
            queryAndDecode(
                () => supabase.from("gifts_dto").select("*"),
                GiftDtoChunk,
            ),
        create: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "create_gift",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(CreateGiftArgs)(
                            args,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ) as any,
                    ),
                GiftId,
            ),
        update: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "update_gift",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(UpdateGiftArgs)(
                            args,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ) as any,
                    ),
                Schema.Void,
            ),
        delete: (id) =>
            queryAndDecode(
                () => supabase.from("gifts").delete().eq("id", id).single(),
                Schema.Void,
            ),
    }),
);
