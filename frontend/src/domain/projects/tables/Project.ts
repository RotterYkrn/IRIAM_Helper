import { Schema } from "effect";

import type { Database } from "@/lib/database.types";

/** {@link ProjectSchema} */
export type ProjectEncoded = Readonly<
    Database["public"]["Tables"]["projects"]["Row"]
>;

export const ProjectIdSchema = Schema.UUID.pipe(Schema.brand("ProjectId"));
export type ProjectId = typeof ProjectIdSchema.Type;
export type ProjectIdEncoded = typeof ProjectIdSchema.Encoded;

/**
 * 企画の種類
 *
 * `"endurance"`: 耐久企画\
 * `"gacha"`: ガチャ企画\
 * `"panel_open"`: パネル開け企画
 */
export const ProjectTypeSchema = Schema.String.pipe(
    Schema.compose(Schema.Literal("endurance", "gacha", "panel_open")),
    Schema.brand("ProjectType"),
);

/**
 * 企画のステータス
 *
 * `"scheduled"`: 開催予定\
 * `"active"`: 開催中\
 * `"finished"`: 開催済み
 */
export const ProjectStatusSchema = Schema.String.pipe(
    Schema.compose(Schema.Literal("scheduled", "active", "finished")),
    Schema.brand("ProjectStatus"),
);

export const ProjectTitleSchema = Schema.String.pipe(
    Schema.minLength(1, {
        message: () => "1文字以上入力してください",
    }),
    Schema.brand("ProjectTitle"),
);

/** {@link ProjectSchema} */
export type Project = Readonly<{
    id: typeof ProjectIdSchema.Type;

    /** {@link ProjectTypeSchema} */
    type: typeof ProjectTypeSchema.Type;

    /** {@link ProjectStatusSchema} */
    status: typeof ProjectStatusSchema.Type;

    title: typeof ProjectTitleSchema.Type;

    created_at: Date;

    updated_at: Date;
}>;

/**
 * projectsテーブル\
 * 企画共通の情報
 */
export const ProjectSchema: Schema.Schema<Project, ProjectEncoded> =
    Schema.Struct({
        id: ProjectIdSchema,
        title: ProjectTitleSchema,
        type: ProjectTypeSchema,
        status: ProjectStatusSchema,
        created_at: Schema.Date,
        updated_at: Schema.Date,
    });

/**
 * 一覧表示用の企画情報
 */
export const ProjectForSideBerSchema = ProjectSchema.pipe(
    Schema.pick("id", "title", "type", "status"),
);
/** {@link ProjectForSideBerSchema} */
export type ProjectForSideBer = typeof ProjectForSideBerSchema.Type;
/** {@link ProjectForSideBerSchema} */
export type ProjectForSideBerEncoded = typeof ProjectForSideBerSchema.Encoded;
