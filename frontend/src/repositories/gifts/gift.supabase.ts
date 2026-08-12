import { GiftDtoChunk } from "@/domain/gifts/dto/GiftDto";
import { CreateGiftArgs } from "@/domain/gifts/rpc/CreateGift";
import { ImportExportGiftArgs } from "@/domain/gifts/rpc/ImportExportGift";
import { UpdateGiftArgs } from "@/domain/gifts/rpc/UpdateGift";
import { GiftId } from "@/domain/gifts/tables/Gifts";
import { supabase } from "@/lib/supabase";
import { queryAndDecode } from "@/utils/api";
import { Layer, Schema } from "effect";
import { GiftRepository } from "./gift.repository";

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
        import: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "import_gift_data",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(ImportExportGiftArgs)(
                            args,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ) as any,
                    ),
                Schema.Void,
            ),
    }),
);
