import { Schema } from "effect";

import {
    ProjectIdSchema,
    ProjectSchema,
    ProjectStatusSchema,
    ProjectTitleSchema,
} from "../../projects/tables/Project";
import type { EnduranceActionCountsSchema } from "../tables/EnduranceActionCounts";
import {
    EnduranceCurrentCountSchema,
    EnduranceNormalCountSchema,
    EnduranceRescueCountSchema,
    EnduranceSabotageCountSchema,
} from "../tables/EnduranceProgress";
import { EnduranceTargetCountSchema } from "../tables/EnduranceSettings";
import type { EnduranceUnitsSchema } from "../tables/EnduranceUnits";

import type { Database } from "@/lib/database.types";
import { withStrictNullCheck } from "@/utils/schema";

export type EnduranceProjectViewEncoded = Readonly<
    Database["public"]["Views"]["endurance_project_view_new"]["Row"]
>;

export type EnduranceProjectView = Readonly<{
    id: typeof ProjectSchema.Type.id;
    title: typeof ProjectSchema.Type.title;
    status: typeof ProjectSchema.Type.status;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
    current_count: typeof EnduranceUnitsSchema.Type.current_count;
    normal_count: typeof EnduranceActionCountsSchema.Type.normal_count;
    rescue_count: typeof EnduranceActionCountsSchema.Type.rescue_count;
    sabotage_count: typeof EnduranceActionCountsSchema.Type.sabotage_count;
}>;

export const EnduranceProjectViewSchema: Schema.Schema<
    EnduranceProjectView,
    EnduranceProjectViewEncoded
> = Schema.Struct({
    id: withStrictNullCheck(ProjectIdSchema),
    title: withStrictNullCheck(ProjectTitleSchema),
    status: withStrictNullCheck(ProjectStatusSchema),
    target_count: withStrictNullCheck(EnduranceTargetCountSchema),
    normal_count: withStrictNullCheck(EnduranceNormalCountSchema),
    rescue_count: withStrictNullCheck(EnduranceRescueCountSchema),
    sabotage_count: withStrictNullCheck(EnduranceSabotageCountSchema),
    current_count: withStrictNullCheck(EnduranceCurrentCountSchema),
});
