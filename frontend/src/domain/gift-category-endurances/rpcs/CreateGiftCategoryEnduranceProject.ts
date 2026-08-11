import {
    EnduranceTargetCountSchema,
    EnduranceUnitPositionSchema,
    type EnduranceUnitsSchema,
} from "@/domain/endurances/tables/EnduranceUnits";
import { GiftId } from "@/domain/gifts/tables/Gifts";
import {
    ProjectTitleSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import {
    mapFrom,
    withStrictNullCheck,
    type RecursiveReadonly,
} from "@/utils/schema";
import { Schema } from "effect";
import { GiftCategoryEnduranceProjectDto } from "../dto/GiftCategoryEnduranceProjectDto";

type CreateGiftCategoryUnitArgsEncoded = Readonly<
    Database["public"]["CompositeTypes"]["create_gift_category_unit_args"]
>;
export type CreateGiftCategoryUnitArgs = {
    position: typeof EnduranceUnitsSchema.Type.position;
    gift_id: GiftId;
};
export const CreateGiftCategoryUnitArgs: Schema.Schema<
    CreateGiftCategoryUnitArgs,
    CreateGiftCategoryUnitArgsEncoded
> = Schema.Struct({
    position: withStrictNullCheck(EnduranceUnitPositionSchema),
    gift_id: withStrictNullCheck(GiftId),
});
export const CreateGiftCategoryUnitArgsChunk = Schema.Chunk(
    CreateGiftCategoryUnitArgs,
);

type CreateGiftCategoryEnduranceProjectArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["create_gift_category_endurance_project"]["Args"]
>;
export type CreateGiftCategoryEnduranceProjectArgs = Readonly<{
    title: typeof ProjectSchema.Type.title;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
    units: typeof CreateGiftCategoryUnitArgsChunk.Type;
}>;
export const CreateGiftCategoryEnduranceProjectArgsSchema: Schema.Schema<
    CreateGiftCategoryEnduranceProjectArgs,
    CreateGiftCategoryEnduranceProjectArgsEncoded
> = Schema.Struct({
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    target_count: EnduranceTargetCountSchema.pipe(mapFrom("p_target_count")),
    units: CreateGiftCategoryUnitArgsChunk.pipe(mapFrom("p_units")),
});

export type CreateGiftCategoryEnduranceProjectReturnsEncoded =
    RecursiveReadonly<
        Database["public"]["Functions"]["create_gift_category_endurance_project"]["Returns"]
    >;
export type CreateGiftCategoryEnduranceProjectReturns =
    GiftCategoryEnduranceProjectDto;
export const CreateGiftCategoryEnduranceProjectReturnsSchema: Schema.Schema<
    CreateGiftCategoryEnduranceProjectReturns,
    CreateGiftCategoryEnduranceProjectReturnsEncoded
> = GiftCategoryEnduranceProjectDto;
