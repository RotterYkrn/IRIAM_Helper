import { Schema } from "effect";

import { ProjectIdSchema, type Project } from "../projects/Project";

import type { EnduranceSettings } from "./EnduranceSettings";

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

export type IncrementEnduranceCountArgsEncoded = Readonly<
    Database["public"]["Functions"]["increment_endurance_count"]["Args"]
>;
export type IncrementEnduranceCountArgs = Pick<Project, "id"> &
    Pick<EnduranceSettings, "increment_per_action">;
export const IncrementEnduranceCountArgsSchema: Schema.Schema<
    IncrementEnduranceCountArgs,
    IncrementEnduranceCountArgsEncoded
> = Schema.Struct({
    id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    increment_per_action: Schema.Number.pipe(mapFrom("p_increment")),
});
