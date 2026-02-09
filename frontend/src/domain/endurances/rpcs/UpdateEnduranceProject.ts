import { Schema } from "effect";

import {
    EnduranceActionAmountSchema,
    EnduranceActionIdSchema,
    EnduranceActionLabelSchema,
    type EnduranceActions,
} from "../tables/EnduranceActions";
import {
    EnduranceTargetCountSchema,
    type EnduranceSettings,
} from "../tables/EnduranceSettings";

import {
    type Project,
    ProjectIdSchema,
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
export type UpdateEnduranceActionArgs = Pick<
    EnduranceActions,
    "id" | "label" | "amount"
>;
export const UpdateEnduranceActionArgsSchema: Schema.Schema<
    UpdateEnduranceActionArgs,
    UpdateEnduranceActionArgsEncoded
> = Schema.Struct({
    id: withStrictNullCheck(EnduranceActionIdSchema),
    label: withStrictNullCheck(EnduranceActionLabelSchema),
    amount: withStrictNullCheck(EnduranceActionAmountSchema),
});
export const UpdateEnduranceActionArgsChunkSchema = Schema.Chunk(
    UpdateEnduranceActionArgsSchema,
);

export type UpdateEnduranceProjectArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["update_endurance_project"]["Args"]
>;
export type UpdateEnduranceProjectArgs = Pick<Project, "id" | "title"> &
    Pick<EnduranceSettings, "target_count"> &
    Readonly<{
        rescue_actions: typeof UpdateEnduranceActionArgsChunkSchema.Type;
        sabotage_actions: typeof UpdateEnduranceActionArgsChunkSchema.Type;
    }>;
export const UpdateEnduranceProjectArgsSchema: Schema.Schema<
    UpdateEnduranceProjectArgs,
    UpdateEnduranceProjectArgsEncoded
> = Schema.Struct({
    id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    target_count: EnduranceTargetCountSchema.pipe(mapFrom("p_target_count")),
    rescue_actions: UpdateEnduranceActionArgsChunkSchema.pipe(
        mapFrom("p_rescue_actions"),
    ),
    sabotage_actions: UpdateEnduranceActionArgsChunkSchema.pipe(
        mapFrom("p_sabotage_actions"),
    ),
});
