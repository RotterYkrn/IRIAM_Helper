import { Context, type Effect } from "effect";

import type {
    GiftCategoryChunk,
    GiftCategoryId,
    GiftCategoryName,
} from "@/domain/gifts/tables/Categories";

export interface GiftCategoryRepository {
    readonly getAll: () => Effect.Effect<GiftCategoryChunk, Error>;
    readonly create: (name: GiftCategoryName) => Effect.Effect<void, Error>;
    readonly update: (
        id: GiftCategoryId,
        name: GiftCategoryName,
    ) => Effect.Effect<void, Error>;
    readonly delete: (id: GiftCategoryId) => Effect.Effect<void, Error>;
}

export const GiftCategoryRepository =
    Context.GenericTag<GiftCategoryRepository>(
        "@repository/GiftCategoryRepository",
    );
