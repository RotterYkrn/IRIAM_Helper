import { Schema } from "effect";

import {
    ProjectIdSchema,
    ProjectStatusSchema,
    ProjectTitleSchema,
    type Project,
} from "../../projects/tables/Project";
import {
    EnduranceCurrentCountSchema,
    EnduranceNormalCountSchema,
    EnduranceRescueCountSchema,
    EnduranceSabotageCountSchema,
    type EnduranceProgress,
} from "../tables/EnduranceProgress";
import {
    EnduranceTargetCountSchema,
    type EnduranceSettings,
} from "../tables/EnduranceSettings";

import type { Database } from "@/lib/database.types";
import { withStrictNullCheck } from "@/utils/schema";

export type EnduranceProjectViewEncoded = Readonly<
    Database["public"]["Views"]["endurance_project_view"]["Row"]
>;

export type EnduranceProjectView = Pick<Project, "id" | "title" | "status"> &
    Pick<EnduranceSettings, "target_count"> &
    Pick<
        EnduranceProgress,
        "normal_count" | "rescue_count" | "sabotage_count" | "current_count"
    >;

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
