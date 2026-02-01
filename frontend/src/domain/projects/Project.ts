import { Schema } from "effect";

import type { Database } from "@/lib/database.types";

export type ProjectEncoded = Readonly<
    Database["public"]["Tables"]["projects"]["Row"]
>;

export const ProjectIdSchema = Schema.UUID.pipe(Schema.brand("ProjectId"));
export type ProjectId = typeof ProjectIdSchema.Type;
export type ProjectIdEncoded = typeof ProjectIdSchema.Encoded;

export const ProjectType = Schema.String.pipe(
    Schema.compose(Schema.Literal("endurance", "gacha", "panel_open")),
    Schema.brand("ProjectType"),
);

export const ProjectStatus = Schema.String.pipe(
    Schema.compose(Schema.Literal("scheduled", "active", "finished")),
    Schema.brand("ProjectStatus"),
);

export type Project = Readonly<{
    id: typeof ProjectIdSchema.Type;
    type: typeof ProjectType.Type;
    status: typeof ProjectStatus.Type;
    title: string;
    created_at: Date;
    updated_at: Date;
}>;

export const ProjectSchema: Schema.Schema<Project, ProjectEncoded> =
    Schema.Struct({
        id: ProjectIdSchema,
        title: Schema.String,
        type: ProjectType,
        status: ProjectStatus,
        created_at: Schema.Date,
        updated_at: Schema.Date,
    });

export const ProjectForSideBerSchema = ProjectSchema.pipe(
    Schema.pick("id", "title", "type", "status"),
);
export type ProjectForSideBer = typeof ProjectForSideBerSchema.Type;
export type ProjectForSideBerEncoded = typeof ProjectForSideBerSchema.Encoded;
