import { Schema } from "effect";

import { type Project, ProjectIdSchema } from "../tables/Project";

import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type DeleteProjectArgsEncoded = Readonly<
    Database["public"]["Functions"]["delete_project"]["Args"]
>;
export type DeleteProjectArgs = Pick<Project, "id">;
export const DeleteProjectArgsSchema: Schema.Schema<
    DeleteProjectArgs,
    DeleteProjectArgsEncoded
> = Schema.Struct({
    id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
});
