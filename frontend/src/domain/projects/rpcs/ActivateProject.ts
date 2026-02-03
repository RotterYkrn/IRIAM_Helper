import { Schema } from "effect";

import { type Project, ProjectIdSchema } from "../tables/Project";

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
