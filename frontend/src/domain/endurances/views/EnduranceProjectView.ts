import { Schema } from "effect";

import {
    ProjectIdSchema,
    ProjectStatus,
    type Project,
} from "../../projects/tables/Project";
import { type EnduranceProgress } from "../tables/EnduranceProgress";
import { type EnduranceSettings } from "../tables/EnduranceSettings";

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
    title: withStrictNullCheck(Schema.String),
    status: withStrictNullCheck(ProjectStatus),
    target_count: withStrictNullCheck(Schema.Number),
    current_count: withStrictNullCheck(Schema.Number),
});
