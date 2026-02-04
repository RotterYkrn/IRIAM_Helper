import { Schema } from "effect";

import {
    EnduranceTargetCountSchema,
    type EnduranceSettings,
} from "../tables/EnduranceSettings";

import {
    ProjectIdSchema,
    ProjectTitleSchema,
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
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    target_count: EnduranceTargetCountSchema.pipe(mapFrom("p_target_count")),
});

export type CreateEnduranceProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_endurance_project"]["Returns"]
>;
export type CreateEnduranceProjectReturns = typeof ProjectSchema.Type.id;
export const CreateEnduranceProjectReturnsSchema: Schema.Schema<
    CreateEnduranceProjectReturns,
    CreateEnduranceProjectReturnsEncoded
> = ProjectIdSchema;
