import { Schema } from "effect";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type DuplicateEnduranceProjectArgsEncoded = Readonly<
    Database["public"]["Functions"]["duplicate_endurance_project"]["Args"]
>;
export type DuplicateEnduranceProjectArgs = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
}>;
export const DuplicateEnduranceProjectArgsSchema: Schema.Schema<
    DuplicateEnduranceProjectArgs,
    DuplicateEnduranceProjectArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
});

export type DuplicateEnduranceProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["duplicate_endurance_project"]["Returns"]
>;
export type DuplicateEnduranceProjectReturns = typeof ProjectSchema.Type.id;
export const DuplicateEnduranceProjectReturnsSchema: Schema.Schema<
    DuplicateEnduranceProjectReturns,
    DuplicateEnduranceProjectReturnsEncoded
> = ProjectIdSchema;
