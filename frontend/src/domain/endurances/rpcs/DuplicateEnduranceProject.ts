import { Schema } from "effect";

import {
    EnduranceProjectDtoSchema,
    type EnduranceProjectDto,
} from "../dto/EnduranceProjectDto";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom, type RecursiveReadonly } from "@/utils/schema";

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

export type DuplicateEnduranceProjectReturnsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["duplicate_endurance_project"]["Returns"]
>;
export type DuplicateEnduranceProjectReturns = EnduranceProjectDto;
export const DuplicateEnduranceProjectReturnsSchema: Schema.Schema<
    DuplicateEnduranceProjectReturns,
    DuplicateEnduranceProjectReturnsEncoded
> = EnduranceProjectDtoSchema;
