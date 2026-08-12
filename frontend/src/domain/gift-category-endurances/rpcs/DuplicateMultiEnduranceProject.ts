import { Schema } from "effect";

import { GiftCategoryEnduranceProjectDto } from "../dto/GiftCategoryEnduranceProjectDto";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom, type RecursiveReadonly } from "@/utils/schema";

export type DuplicateGiftCategoryEnduranceProjectArgsEncoded = Readonly<
    Database["public"]["Functions"]["duplicate_gift_category_endurance_project"]["Args"]
>;
export type DuplicateGiftCategoryEnduranceProjectArgs = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
}>;
export const DuplicateGiftCategoryEnduranceProjectArgs: Schema.Schema<
    DuplicateGiftCategoryEnduranceProjectArgs,
    DuplicateGiftCategoryEnduranceProjectArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
});

export type DuplicateGiftCategoryEnduranceProjectReturnsEncoded =
    RecursiveReadonly<
        Database["public"]["Functions"]["duplicate_gift_category_endurance_project"]["Returns"]
    >;
export type DuplicateGiftCategoryEnduranceProjectReturns =
    GiftCategoryEnduranceProjectDto;
export const DuplicateGiftCategoryEnduranceProjectReturns: Schema.Schema<
    DuplicateGiftCategoryEnduranceProjectReturns,
    DuplicateGiftCategoryEnduranceProjectReturnsEncoded
> = GiftCategoryEnduranceProjectDto;
