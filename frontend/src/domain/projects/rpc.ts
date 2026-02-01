import { Schema } from "effect";

import { ProjectIdSchema, type Project } from "./Project";

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
