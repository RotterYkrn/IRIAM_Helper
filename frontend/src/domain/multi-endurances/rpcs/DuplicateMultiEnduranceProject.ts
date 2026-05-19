import { Schema } from "effect";

import {
    MultiEnduranceProjectDtoSchema,
    type MultiEnduranceProjectDto,
} from "../dto/MultiEnduranceProjectDto";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom, type RecursiveReadonly } from "@/utils/schema";

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

export type DuplicateMultiEnduranceProjectReturnsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["duplicate_multi_endurance_project"]["Returns"]
>;
export type DuplicateMultiEnduranceProjectReturns = MultiEnduranceProjectDto;
export const DuplicateMultiEnduranceProjectReturnsSchema: Schema.Schema<
    DuplicateMultiEnduranceProjectReturns,
    DuplicateMultiEnduranceProjectReturnsEncoded
> = MultiEnduranceProjectDtoSchema;
