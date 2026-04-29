import { Chunk, Schema } from "effect";

import {
    EnduranceTargetCountSchema,
    EnduranceUnitIdSchema,
    EnduranceUnitLabelSchema,
    EnduranceUnitPositionSchema,
    EnduranceUnitsSchema,
} from "@/domain/endurances-new/tables/EnduranceUnits";
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

export type UpdateUnitArgsEncoded = RecursiveReadonly<
    Database["public"]["CompositeTypes"]["update_unit_args"]
>;
export type UpdateUnitArgs = Readonly<{
    id: typeof EnduranceUnitsSchema.Type.id | null;
    position: typeof EnduranceUnitsSchema.Type.position;
    label: typeof EnduranceUnitsSchema.Type.label;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
}>;
export const UpdateUnitArgsSchema: Schema.Schema<
    UpdateUnitArgs,
    UpdateUnitArgsEncoded
> = Schema.Struct({
    id: Schema.NullOr(EnduranceUnitIdSchema),
    position: withStrictNullCheck(EnduranceUnitPositionSchema),
    label: withStrictNullCheck(EnduranceUnitLabelSchema),
    target_count: withStrictNullCheck(EnduranceTargetCountSchema),
});
export const UpdateUnitArgsChunkSchema = Schema.Chunk(UpdateUnitArgsSchema);

export type UpdateMultiEnduranceProjectArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["update_multi_endurance_project"]["Args"]
>;
export type UpdateMultiEnduranceProjectArgs = Readonly<{
    id: typeof ProjectSchema.Type.id;
    title: typeof ProjectSchema.Type.title;
    units: Chunk.Chunk<UpdateUnitArgs>;
}>;
export const UpdateMultiEnduranceProjectArgsSchema: Schema.Schema<
    UpdateMultiEnduranceProjectArgs,
    UpdateMultiEnduranceProjectArgsEncoded
> = Schema.Struct({
    id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    units: UpdateUnitArgsChunkSchema.pipe(mapFrom("p_units")),
});

export type UpdateMultiEnduranceProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_multi_endurance_project"]["Returns"]
>;
export type UpdateMultiEnduranceProjectReturns = typeof ProjectSchema.Type.id;
export const UpdateMultiEnduranceProjectReturnsSchema: Schema.Schema<
    UpdateMultiEnduranceProjectReturns,
    UpdateMultiEnduranceProjectReturnsEncoded
> = ProjectIdSchema;
