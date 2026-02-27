import { Schema } from "effect";

import {
    EnduranceActionStatNewSchema,
    type EnduranceActionStatNew,
} from "../types/EnduranceActionStatNew";

import { ProjectIdSchema } from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { withStrictNullCheck, type RecursiveReadonly } from "@/utils/schema";

/** {@link EnduranceActionStatViewNewSchema} */
export type EnduranceActionStatViewNewEncoded = RecursiveReadonly<
    Database["public"]["Views"]["endurance_action_stats_view_new"]["Row"]
>;

/**
 * 救済アクション
 * type: "rescue" に制限
 */
export const EnduranceRescueActionSchema = EnduranceActionStatNewSchema.pipe(
    Schema.filter(
        (a): a is EnduranceActionStatNew & { readonly type: "rescue" } =>
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

/**
 * 妨害アクション
 * type: "sabotage" に制限
 */
export const EnduranceSabotageActionSchema = EnduranceActionStatNewSchema.pipe(
    Schema.filter(
        (a): a is EnduranceActionStatNew & { readonly type: "sabotage" } =>
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

/** {@link EnduranceActionStatsViewNewSchema} */
export type EnduranceActionStatViewNew = Readonly<{
    project_id: typeof ProjectIdSchema.Type;

    /** {@link EnduranceRescueActionSchema} */
    rescue_actions: typeof EnduranceRescueActionChunkSchema.Type;

    /** {@link EnduranceSabotageActionSchema} */
    sabotage_actions: typeof EnduranceSabotageActionChunkSchema.Type;
}>;

/**
 * endurance_action_stats_view_new ビュー
 * 救済・妨害アクションの情報
 */
export const EnduranceActionStatsViewNewSchema: Schema.Schema<
    EnduranceActionStatViewNew,
    EnduranceActionStatViewNewEncoded
> = Schema.Struct({
    project_id: withStrictNullCheck(ProjectIdSchema),
    rescue_actions: withStrictNullCheck(EnduranceRescueActionChunkSchema),
    sabotage_actions: withStrictNullCheck(EnduranceSabotageActionChunkSchema),
});
