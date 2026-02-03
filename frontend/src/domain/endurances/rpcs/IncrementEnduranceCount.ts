import { Schema } from "effect";

import type { EnduranceSettings } from "../tables/EnduranceSettings";

import {
    type Project,
    ProjectIdSchema,
    ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type IncrementEnduranceCountArgsEncoded = Readonly<
    Database["public"]["Functions"]["increment_endurance_count"]["Args"]
>;
export type IncrementEnduranceCountArgs = Pick<Project, "id"> &
    Pick<EnduranceSettings, "increment_per_action">;
export const IncrementEnduranceCountArgsSchema: Schema.Schema<
    IncrementEnduranceCountArgs,
    IncrementEnduranceCountArgsEncoded
> = Schema.Struct({
    id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    increment_per_action: Schema.Number.pipe(mapFrom("p_increment")),
});

export type IncrementEnduranceCountReturnsEncoded = Readonly<
    Database["public"]["Functions"]["increment_endurance_count"]["Returns"]
>;
export type IncrementEnduranceCountReturns = typeof ProjectSchema.Type.id;
export const IncrementEnduranceCountReturnsSchema: Schema.Schema<
    IncrementEnduranceCountReturns,
    IncrementEnduranceCountReturnsEncoded
> = ProjectIdSchema;
