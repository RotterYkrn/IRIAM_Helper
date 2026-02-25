import { Schema } from "effect";

import {
    EnduranceActionStatSchema,
    type EnduranceActionStat,
} from "../types/EnduranceActionStat";

import { ProjectIdSchema } from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { withStrictNullCheck, type RecursiveReadonly } from "@/utils/schema";

export type EnduranceActionStatsViewEncoded = RecursiveReadonly<
    Database["public"]["Views"]["endurance_action_stats_view"]["Row"]
>;

export const EnduranceRescueActionSchema = EnduranceActionStatSchema.pipe(
    Schema.filter(
        (a): a is EnduranceActionStat & { readonly type: "rescue" } =>
            a.type === "rescue",
        {
            message: () => "Type must be 'rescue'",
            identifier: "RescueAction",
        },
    ),
);
export const EnduranceRescueActionChunkSchema = Schema.Chunk(
    EnduranceRescueActionSchema,
);

export const EnduranceSabotageActionSchema = EnduranceActionStatSchema.pipe(
    Schema.filter(
        (a): a is EnduranceActionStat & { readonly type: "sabotage" } =>
            a.type === "sabotage",
        {
            message: () => "Type must be 'sabotage'",
            identifier: "SabotageAction",
        },
    ),
);
export const EnduranceSabotageActionChunkSchema = Schema.Chunk(
    EnduranceSabotageActionSchema,
);

export type EnduranceActionStatsView = Readonly<{
    project_id: typeof ProjectIdSchema.Type;
    rescue_actions: typeof EnduranceRescueActionChunkSchema.Type;
    sabotage_actions: typeof EnduranceSabotageActionChunkSchema.Type;
}>;

export const EnduranceActionStatsViewSchema: Schema.Schema<
    EnduranceActionStatsView,
    EnduranceActionStatsViewEncoded
> = Schema.Struct({
    project_id: withStrictNullCheck(ProjectIdSchema),
    rescue_actions: withStrictNullCheck(EnduranceRescueActionChunkSchema),
    sabotage_actions: withStrictNullCheck(EnduranceSabotageActionChunkSchema),
});
