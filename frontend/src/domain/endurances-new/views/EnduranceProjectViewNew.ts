import { Schema } from "effect";

import {
    ProjectIdSchema,
    ProjectSchema,
    ProjectStatusSchema,
    ProjectTitleSchema,
} from "../../projects/tables/Project";
import {
    EnduranceNormalCountSchema,
    EnduranceRescueCountSchema,
    EnduranceSabotageCountSchema,
    type EnduranceActionCountsSchema,
} from "../tables/EnduranceActionCounts";
import {
    EnduranceCurrentCountSchema,
    EnduranceTargetCountSchema,
    EnduranceUnitIdSchema,
    type EnduranceUnitsSchema,
} from "../tables/EnduranceUnits";

import type { Database } from "@/lib/database.types";
import { withStrictNullCheck } from "@/utils/schema";

/** {@link EnduranceProjectViewNewSchema} */
export type EnduranceProjectViewNewEncoded = Readonly<
    Database["public"]["Views"]["endurance_project_view_new"]["Row"]
>;

/** {@link EnduranceProjectViewNewSchema} */
export type EnduranceProjectViewNew = Readonly<{
    id: typeof ProjectSchema.Type.id;
    title: typeof ProjectSchema.Type.title;
    status: typeof ProjectSchema.Type.status;
    unit_id: typeof EnduranceUnitsSchema.Type.id;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
    current_count: typeof EnduranceUnitsSchema.Type.current_count;
    normal_count: typeof EnduranceActionCountsSchema.Type.normal_count;
    rescue_count: typeof EnduranceActionCountsSchema.Type.rescue_count;
    sabotage_count: typeof EnduranceActionCountsSchema.Type.sabotage_count;
}>;

/**
 * endurance_project_view_new ビュー
 * 耐久企画の情報（救済・妨害アクションを除く）
 */
export const EnduranceProjectViewNewSchema: Schema.Schema<
    EnduranceProjectViewNew,
    EnduranceProjectViewNewEncoded
> = Schema.Struct({
    id: withStrictNullCheck(ProjectIdSchema),
    title: withStrictNullCheck(ProjectTitleSchema),
    status: withStrictNullCheck(ProjectStatusSchema),
    unit_id: withStrictNullCheck(EnduranceUnitIdSchema),
    target_count: withStrictNullCheck(EnduranceTargetCountSchema),
    normal_count: withStrictNullCheck(EnduranceNormalCountSchema),
    rescue_count: withStrictNullCheck(EnduranceRescueCountSchema),
    sabotage_count: withStrictNullCheck(EnduranceSabotageCountSchema),
    current_count: withStrictNullCheck(EnduranceCurrentCountSchema),
});
