import { pipe, Schema } from "effect";

import {
    EnduranceSettingsSchema,
    EnduranceTargetCountSchema,
    type EnduranceSettings,
    type EnduranceSettingsEncoded,
} from "../tables/EnduranceSettings";

import {
    type Project,
    type ProjectEncoded,
    ProjectIdSchema,
    ProjectSchema,
    ProjectTitleSchema,
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
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    target_count: EnduranceTargetCountSchema.pipe(mapFrom("p_target_count")),
});

export type UpdateEnduranceProjectReturnsEncoded = Pick<
    ProjectEncoded,
    "id" | "title"
> &
    Pick<EnduranceSettingsEncoded, "target_count">;
export type UpdateEnduranceProjectReturns = UpdateEnduranceProjectArgs;
export const UpdateEnduranceProjectReturnsSchema: Schema.Schema<
    UpdateEnduranceProjectReturns,
    UpdateEnduranceProjectReturnsEncoded
> = pipe(
    ProjectSchema.pipe(Schema.pick("id", "title")),
    Schema.extend(EnduranceSettingsSchema.pipe(Schema.pick("target_count"))),
);
