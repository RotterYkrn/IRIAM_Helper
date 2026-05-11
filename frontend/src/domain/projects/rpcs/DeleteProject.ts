import { Schema } from "effect";

import { ProjectIdSchema, ProjectSchema } from "../tables/Project";

import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type DeleteProjectArgsEncoded = Readonly<
    Database["public"]["Functions"]["delete_project"]["Args"]
>;
export type DeleteProjectArgs = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
}>;
export const DeleteProjectArgsSchema: Schema.Schema<
    DeleteProjectArgs,
    DeleteProjectArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
});
