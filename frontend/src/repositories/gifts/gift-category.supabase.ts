import { GiftCategoryChunk } from "@/domain/gifts/tables/Categories";
import { supabase } from "@/lib/supabase";
import { queryAndDecode } from "@/utils/api";
import { Layer, Schema } from "effect";
import { GiftCategoryRepository } from "./gift-category.repository";

export const GiftCategorySupabase = Layer.succeed(
    GiftCategoryRepository,
    GiftCategoryRepository.of({
        getAll: () =>
            queryAndDecode(
                () => supabase.from("gift_categories").select("*"),
                GiftCategoryChunk,
            ),
        create: (name) =>
            queryAndDecode(
                () =>
                    supabase.from("gift_categories").insert({ name }).single(),
                Schema.Void,
            ),
        update: (id, name) =>
            queryAndDecode(
                () =>
                    supabase
                        .from("gift_categories")
                        .update({ name })
                        .eq("id", id)
                        .single(),
                Schema.Void,
            ),
        delete: (id) =>
            queryAndDecode(
                () =>
                    supabase
                        .from("gift_categories")
                        .delete()
                        .eq("id", id)
                        .single(),
                Schema.Void,
            ),
    }),
);
