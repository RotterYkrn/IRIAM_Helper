import { Schema } from "effect";

import {
    EnduranceActionAmountSchema,
    EnduranceActionIdSchema,
    EnduranceActionLabelSchema,
    EnduranceActionPositionSchema,
    EnduranceActionsNewSchema,
} from "../tables/EnduranceActionsNew";
import {
    EnduranceTargetCountSchema,
    EnduranceUnitIdSchema,
    type EnduranceUnitsSchema,
} from "../tables/EnduranceUnits";

import {
    ProjectIdSchema,
    ProjectSchema,
    ProjectTitleSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import {
    mapFrom,
    withStrictNullCheck,
    type RecursiveReadonly,
} from "@/utils/schema";

export type UpdateEnduranceActionArgsEncoded = Readonly<
    Database["public"]["CompositeTypes"]["update_endurance_action_args"]
>;
export type UpdateEnduranceActionArgs = Readonly<{
    /**
     * {@link EnduranceActionIdSchema}\
     * 新規追加の場合は null
     */
    id: typeof EnduranceActionsNewSchema.Type.id | null;

    /** {@link EnduranceActionPositionSchema} */
    position: typeof EnduranceActionsNewSchema.Type.position;

    label: typeof EnduranceActionsNewSchema.Type.label;

    /** {@link EnduranceActionAmountSchema} */
    amount: typeof EnduranceActionsNewSchema.Type.amount;
}>;
export const UpdateEnduranceActionArgsSchema: Schema.Schema<
    UpdateEnduranceActionArgs,
    UpdateEnduranceActionArgsEncoded
> = Schema.Struct({
    id: Schema.NullOr(EnduranceActionIdSchema),
    position: withStrictNullCheck(EnduranceActionPositionSchema),
    label: withStrictNullCheck(EnduranceActionLabelSchema),
    amount: withStrictNullCheck(EnduranceActionAmountSchema),
});
export const UpdateEnduranceActionArgsChunkSchema = Schema.Chunk(
    UpdateEnduranceActionArgsSchema,
);

export type UpdateEnduranceProjectNewArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["update_endurance_project_new"]["Args"]
>;
export type UpdateEnduranceProjectNewArgs = Readonly<{
    id: typeof ProjectSchema.Type.id;
    unit_id: typeof EnduranceUnitsSchema.Type.id;
    title: typeof ProjectSchema.Type.title;
    target_count: typeof EnduranceTargetCountSchema.Type;
    rescue_actions: typeof UpdateEnduranceActionArgsChunkSchema.Type;
    sabotage_actions: typeof UpdateEnduranceActionArgsChunkSchema.Type;
}>;
export const UpdateEnduranceProjectNewArgsSchema: Schema.Schema<
    UpdateEnduranceProjectNewArgs,
    UpdateEnduranceProjectNewArgsEncoded
> = Schema.Struct({
    id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    unit_id: EnduranceUnitIdSchema.pipe(mapFrom("p_unit_id")),
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    target_count: EnduranceTargetCountSchema.pipe(mapFrom("p_target_count")),
    rescue_actions: UpdateEnduranceActionArgsChunkSchema.pipe(
        mapFrom("p_rescue_actions"),
    ),
    sabotage_actions: UpdateEnduranceActionArgsChunkSchema.pipe(
        mapFrom("p_sabotage_actions"),
    ),
});

export type UpdateEnduranceProjectNewReturnsEncoded = Readonly<
    Database["public"]["Functions"]["update_endurance_project_new"]["Returns"]
>;
export type UpdateEnduranceProjectNewReturns = typeof ProjectSchema.Type.id;
export const UpdateEnduranceProjectNewReturnsSchema: Schema.Schema<
    UpdateEnduranceProjectNewReturns,
    UpdateEnduranceProjectNewReturnsEncoded
> = ProjectIdSchema;
