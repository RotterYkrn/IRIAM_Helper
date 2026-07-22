import type {
    GiftCategory,
    GiftCategoryChunk,
    GiftCategoryId,
    GiftCategoryName,
} from "@/domain/gifts/tables/Categories";
import { Context, type Effect } from "effect";

export interface GiftCategoryRepository {
    readonly getAll: () => Effect.Effect<GiftCategoryChunk, Error>;
    readonly create: (
        name: GiftCategoryName,
    ) => Effect.Effect<GiftCategory, Error>;
    readonly update: (
        id: GiftCategoryId,
        name: GiftCategoryName,
    ) => Effect.Effect<GiftCategory, Error>;
    readonly delete: (id: GiftCategoryId) => Effect.Effect<void, Error>;
}

export const GiftCategoryRepository =
    Context.GenericTag<GiftCategoryRepository>(
        "@repository/GiftCategoryRepository",
    );
