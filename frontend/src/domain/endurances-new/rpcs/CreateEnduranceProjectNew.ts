import { Schema } from "effect";

import {
    EnduranceActionAmountSchema,
    EnduranceActionLabelSchema,
    EnduranceActionPositionSchema,
    type EnduranceActionsNewSchema,
} from "../tables/EnduranceActionsNew";
import {
    EnduranceTargetCountSchema,
    type EnduranceUnitsSchema,
} from "../tables/EnduranceUnits";

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

export type CreateEnduranceActionArgsEncoded = Readonly<
    Database["public"]["CompositeTypes"]["create_endurance_action_args"]
>;
export type CreateEnduranceActionArgs = Readonly<{
    position: typeof EnduranceActionsNewSchema.Type.position;
    label: typeof EnduranceActionsNewSchema.Type.label;
    amount: typeof EnduranceActionsNewSchema.Type.amount;
}>;
export const CreateEnduranceActionArgsSchema: Schema.Schema<
    CreateEnduranceActionArgs,
    CreateEnduranceActionArgsEncoded
> = Schema.Struct({
    position: withStrictNullCheck(EnduranceActionPositionSchema),
    label: withStrictNullCheck(EnduranceActionLabelSchema),
    amount: withStrictNullCheck(EnduranceActionAmountSchema),
});
export const CreateEnduranceActionArgsChunkSchema = Schema.Chunk(
    CreateEnduranceActionArgsSchema,
);

export type CreateEnduranceProjectNewArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["create_endurance_project_new"]["Args"]
>;
export type CreateEnduranceProjectNewArgs = Readonly<{
    title: typeof ProjectSchema.Type.title;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
    rescue_actions: typeof CreateEnduranceActionArgsChunkSchema.Type;
    sabotage_actions: typeof CreateEnduranceActionArgsChunkSchema.Type;
}>;
export const CreateEnduranceProjectNewArgsSchema: Schema.Schema<
    CreateEnduranceProjectNewArgs,
    CreateEnduranceProjectNewArgsEncoded
> = Schema.Struct({
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    target_count: EnduranceTargetCountSchema.pipe(mapFrom("p_target_count")),
    rescue_actions: CreateEnduranceActionArgsChunkSchema.pipe(
        mapFrom("p_rescue_actions"),
    ),
    sabotage_actions: CreateEnduranceActionArgsChunkSchema.pipe(
        mapFrom("p_sabotage_actions"),
    ),
});

export type CreateEnduranceProjectNewReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_endurance_project"]["Returns"]
>;
export type CreateEnduranceProjectNewReturns = typeof ProjectSchema.Type.id;
export const CreateEnduranceProjectNewReturnsSchema: Schema.Schema<
    CreateEnduranceProjectNewReturns,
    CreateEnduranceProjectNewReturnsEncoded
> = ProjectIdSchema;
