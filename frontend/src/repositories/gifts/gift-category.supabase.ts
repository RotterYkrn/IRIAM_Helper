import {
    GiftCategory,
    GiftCategoryChunk,
} from "@/domain/gifts/tables/Categories";
import { Effect, Layer, pipe, Schema } from "effect";
import { GiftCategoryRepository } from "./gift-category.repository";

const categories = [
    { id: 1, name: "定番" },
    { id: 2, name: "プチギフ" },
    { id: 3, name: "イベント" },
];

export const GiftCategorySupabase = Layer.succeed(
    GiftCategoryRepository,
    GiftCategoryRepository.of({
        getAll: () =>
            // queryAndDecode(
            //     () => supabase.from("gift_categories").select("*"),
            //     GiftCategoryChunk,
            // ),
            pipe(categories, Schema.decodeEither(GiftCategoryChunk)),
        create: (name) =>
            // queryAndDecode(
            //     () => supabase.from("gift_categories").insert({ name }).single(),
            //     GiftCategoryChunk,
            // ),
            pipe(
                Effect.gen(function* () {
                    categories.push({ id: categories.length + 1, name });
                    return { id: categories.length, name };
                }),
                Effect.flatMap(Schema.decodeEither(GiftCategory)),
            ),
        update: (id, name) =>
            // queryAndDecode(
            //     () =>
            //         supabase
            //             .from("gift_categories")
            //             .update({ name })
            //             .eq("id", id)
            //             .single(),
            //     GiftCategoryChunk,
            // ),
            pipe(
                Effect.gen(function* () {
                    const category = categories.find((c) => c.id === id);
                    if (category) {
                        category.name = name;
                        return category;
                    } else {
                        throw new Error("Category not found");
                    }
                }),
                Effect.flatMap(Schema.decodeEither(GiftCategory)),
            ),
        delete: (id) =>
            // queryAndDecode(
            //     () => supabase.from("gift_categories").delete().eq("id", id),
            //     Schema.void,
            // ),
            pipe(
                Effect.gen(function* () {
                    const index = categories.findIndex((c) => c.id === id);
                    if (index !== -1) {
                        categories.splice(index, 1);
                    }
                }),
            ),
    }),
);
