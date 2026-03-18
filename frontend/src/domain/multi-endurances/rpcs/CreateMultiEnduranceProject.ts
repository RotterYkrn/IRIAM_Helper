import { Schema } from "effect";

import {
    EnduranceTargetCountSchema,
    EnduranceUnitLabelSchema,
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

export type CreateUnitArgsEncoded = Readonly<
    Database["public"]["CompositeTypes"]["create_unit_args"]
>;
export type CreateUnitArgs = Readonly<{
    label: typeof EnduranceUnitsSchema.Type.label;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
}>;
export const CreateUnitArgsSchema: Schema.Schema<
    CreateUnitArgs,
    CreateUnitArgsEncoded
> = Schema.Struct({
    label: withStrictNullCheck(EnduranceUnitLabelSchema),
    target_count: withStrictNullCheck(EnduranceTargetCountSchema),
});
export const CreateUnitArgsChunkSchema = Schema.Chunk(CreateUnitArgsSchema);

export type CreateMultiEnduranceProjectArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["create_multi_endurance_project"]["Args"]
>;
export type CreateMultiEnduranceProjectArgs = Readonly<{
    title: typeof ProjectSchema.Type.title;
    units: typeof CreateUnitArgsChunkSchema.Type;
}>;
export const CreateMultiEnduranceProjectArgsSchema: Schema.Schema<
    CreateMultiEnduranceProjectArgs,
    CreateMultiEnduranceProjectArgsEncoded
> = Schema.Struct({
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    units: CreateUnitArgsChunkSchema.pipe(mapFrom("p_units")),
});

export type CreateMultiEnduranceProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_multi_endurance_project"]["Returns"]
>;
export type CreateMultiEnduranceProjectReturns = typeof ProjectSchema.Type.id;
export const CreateMultiEnduranceProjectReturnsSchema: Schema.Schema<
    CreateMultiEnduranceProjectReturns,
    CreateMultiEnduranceProjectReturnsEncoded
> = ProjectIdSchema;
