import {
    EnduranceTargetCountSchema,
    EnduranceUnitPositionSchema,
    type EnduranceUnitsSchema,
} from "@/domain/endurances/tables/EnduranceUnits";
import { GiftId } from "@/domain/gifts/tables/Gifts";
import {
    ProjectIdSchema,
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

type UpdateGiftCategoryUnitArgsEncoded = Readonly<
    Database["public"]["CompositeTypes"]["update_gift_category_unit_args"]
>;
export type UpdateGiftCategoryUnitArgs = {
    position: typeof EnduranceUnitsSchema.Type.position;
    gift_id: GiftId;
};
export const UpdateGiftCategoryUnitArgs: Schema.Schema<
    UpdateGiftCategoryUnitArgs,
    UpdateGiftCategoryUnitArgsEncoded
> = Schema.Struct({
    position: withStrictNullCheck(EnduranceUnitPositionSchema),
    gift_id: withStrictNullCheck(GiftId),
});
export const UpdateGiftCategoryUnitArgsChunk = Schema.Chunk(
    UpdateGiftCategoryUnitArgs,
);

type UpdateGiftCategoryEnduranceProjectArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["update_gift_category_endurance_project"]["Args"]
>;
export type UpdateGiftCategoryEnduranceProjectArgs = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
    title: typeof ProjectSchema.Type.title;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
    units: typeof UpdateGiftCategoryUnitArgsChunk.Type;
}>;
export const UpdateGiftCategoryEnduranceProjectArgs: Schema.Schema<
    UpdateGiftCategoryEnduranceProjectArgs,
    UpdateGiftCategoryEnduranceProjectArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    target_count: EnduranceTargetCountSchema.pipe(mapFrom("p_target_count")),
    units: UpdateGiftCategoryUnitArgsChunk.pipe(mapFrom("p_units")),
});

export type UpdateGiftCategoryEnduranceProjectReturnsEncoded =
    RecursiveReadonly<
        Database["public"]["Functions"]["update_gift_category_endurance_project"]["Returns"]
    >;
export type UpdateGiftCategoryEnduranceProjectReturns =
    GiftCategoryEnduranceProjectDto;
export const UpdateGiftCategoryEnduranceProjectReturns: Schema.Schema<
    UpdateGiftCategoryEnduranceProjectReturns,
    UpdateGiftCategoryEnduranceProjectReturnsEncoded
> = GiftCategoryEnduranceProjectDto;
