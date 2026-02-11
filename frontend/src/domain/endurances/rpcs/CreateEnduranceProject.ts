import { Schema } from "effect";

import {
    EnduranceActionAmountSchema,
    EnduranceActionLabelSchema,
    EnduranceActionPositionSchema,
    type EnduranceActions,
} from "../tables/EnduranceActions";
import {
    EnduranceTargetCountSchema,
    type EnduranceSettings,
} from "../tables/EnduranceSettings";

import {
    ProjectIdSchema,
    ProjectTitleSchema,
    type Project,
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
export type CreateEnduranceActionArgs = Pick<
    EnduranceActions,
    "position" | "label" | "amount"
>;
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

export type CreateEnduranceProjectArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["create_endurance_project"]["Args"]
>;
export type CreateEnduranceProjectArgs = Pick<Project, "title"> &
    Pick<EnduranceSettings, "target_count"> &
    Readonly<{
        rescue_actions: typeof CreateEnduranceActionArgsChunkSchema.Type;
        sabotage_actions: typeof CreateEnduranceActionArgsChunkSchema.Type;
    }>;
export const CreateEnduranceProjectArgsSchema: Schema.Schema<
    CreateEnduranceProjectArgs,
    CreateEnduranceProjectArgsEncoded
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

export type CreateEnduranceProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_endurance_project"]["Returns"]
>;
export type CreateEnduranceProjectReturns = typeof ProjectSchema.Type.id;
export const CreateEnduranceProjectReturnsSchema: Schema.Schema<
    CreateEnduranceProjectReturns,
    CreateEnduranceProjectReturnsEncoded
> = ProjectIdSchema;
