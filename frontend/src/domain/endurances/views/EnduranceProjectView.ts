import { Schema } from "effect";

import {
    ProjectIdSchema,
    ProjectStatus,
    ProjectTitleSchema,
    type Project,
} from "../../projects/tables/Project";
import {
    EnduranceCurrentCountSchema,
    type EnduranceProgress,
} from "../tables/EnduranceProgress";
import {
    EnduranceTargetCountSchema,
    type EnduranceSettings,
} from "../tables/EnduranceSettings";

import type { Database } from "@/lib/database.types";
import { withNullAs as withStrictNullCheck } from "@/utils/schema";

export type EnduranceProjectViewEncoded = Readonly<
    Database["public"]["Views"]["endurance_project_view"]["Row"]
>;

export type EnduranceProjectView = Pick<Project, "id" | "title" | "status"> &
    Pick<EnduranceSettings, "target_count"> &
    Pick<EnduranceProgress, "current_count">;

export const EnduranceProjectViewSchema: Schema.Schema<
    EnduranceProjectView,
    EnduranceProjectViewEncoded
> = Schema.Struct({
    id: withStrictNullCheck(ProjectIdSchema),
    title: withStrictNullCheck(ProjectTitleSchema),
    status: withStrictNullCheck(ProjectStatus),
    target_count: withStrictNullCheck(EnduranceTargetCountSchema),
    current_count: withStrictNullCheck(EnduranceCurrentCountSchema),
});
