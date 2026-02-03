import { Schema } from "effect";

import type { EnduranceSettings } from "../tables/EnduranceSettings";

import {
    ProjectIdSchema,
    type Project,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type CreateEnduranceProjectArgsEncoded = Readonly<
    Database["public"]["Functions"]["create_endurance_project"]["Args"]
>;
export type CreateEnduranceProjectArgs = Pick<Project, "title"> &
    Pick<EnduranceSettings, "target_count">;
export const CreateEnduranceProjectArgsSchema: Schema.Schema<
    CreateEnduranceProjectArgs,
    CreateEnduranceProjectArgsEncoded
> = Schema.Struct({
    title: Schema.String.pipe(mapFrom("p_title")),
    target_count: Schema.Number.pipe(mapFrom("p_target_count")),
});

export type CreateEnduranceProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_endurance_project"]["Returns"]
>;
export type CreateEnduranceProjectReturns = typeof ProjectSchema.Type.id;
export const CreateEnduranceProjectReturnsSchema: Schema.Schema<
    CreateEnduranceProjectReturns,
    CreateEnduranceProjectReturnsEncoded
> = ProjectIdSchema;
