import { Schema } from "effect";

import {
    type Project,
    ProjectIdSchema,
    ProjectSchema,
} from "../tables/Project";

import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type ActivateProjectArgsEncoded = Readonly<
    Database["public"]["Functions"]["activate_project"]["Args"]
>;
export type ActivateProjectArgs = Pick<Project, "id">;
export const ActivateProjectArgsSchema: Schema.Schema<
    ActivateProjectArgs,
    ActivateProjectArgsEncoded
> = Schema.Struct({
    id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
});

export type ActivateProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["activate_project"]["Returns"]
>;
export type ActivateProjectReturns = typeof ProjectSchema.Type.id;
export const ActivateProjectReturnsSchema: Schema.Schema<
    ActivateProjectReturns,
    ActivateProjectReturnsEncoded
> = ProjectIdSchema;
