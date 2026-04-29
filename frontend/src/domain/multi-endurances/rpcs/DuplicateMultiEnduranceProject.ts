import { Schema } from "effect";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type DuplicateMultiEnduranceProjectArgsEncoded = Readonly<
    Database["public"]["Functions"]["duplicate_multi_endurance_project"]["Args"]
>;
export type DuplicateMultiEnduranceProjectArgs = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
}>;
export const DuplicateMultiEnduranceProjectArgsSchema: Schema.Schema<
    DuplicateMultiEnduranceProjectArgs,
    DuplicateMultiEnduranceProjectArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
});

export type DuplicateMultiEnduranceProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["duplicate_multi_endurance_project"]["Returns"]
>;
export type DuplicateMultiEnduranceProjectReturns =
    typeof ProjectSchema.Type.id;
export const DuplicateMultiEnduranceProjectReturnsSchema: Schema.Schema<
    DuplicateMultiEnduranceProjectReturns,
    DuplicateMultiEnduranceProjectReturnsEncoded
> = ProjectIdSchema;
