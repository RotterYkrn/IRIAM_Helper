import { Schema } from "effect";

import type { EnduranceSettings } from "../tables/EnduranceSettings";

import {
    type Project,
    ProjectIdSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type UpdateEnduranceProjectArgsEncoded = Readonly<
    Database["public"]["Functions"]["update_endurance_project"]["Args"]
>;
export type UpdateEnduranceProjectArgs = Pick<Project, "id" | "title"> &
    Pick<EnduranceSettings, "target_count">;
export const UpdateEnduranceProjectArgsSchema: Schema.Schema<
    UpdateEnduranceProjectArgs,
    UpdateEnduranceProjectArgsEncoded
> = Schema.Struct({
    id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    title: Schema.String.pipe(mapFrom("p_title")),
    target_count: Schema.Number.pipe(mapFrom("p_target_count")),
});
