import { Schema } from "effect";

import { type Project, ProjectIdSchema } from "../tables/Project";

import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type FinishProjectArgsEncoded = Readonly<
    Database["public"]["Functions"]["finish_project"]["Args"]
>;
export type FinishProjectArgs = Pick<Project, "id">;
export const FinishProjectArgsSchema: Schema.Schema<
    FinishProjectArgs,
    FinishProjectArgsEncoded
> = Schema.Struct({
    id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
});
