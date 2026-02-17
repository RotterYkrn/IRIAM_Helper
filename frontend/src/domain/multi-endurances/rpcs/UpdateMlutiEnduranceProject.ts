import { Schema } from "effect";

import {
    MultiEnduranceLabelSchema,
    MultiEndurancePositionSchema,
    MultiEnduranceSettingsIdSchema,
    MultiEnduranceTargetCountSchema,
    type MultiEnduranceSettingsSchema,
} from "../tables/MultiEnduranceSettings";

import {
    ProjectIdSchema,
    ProjectTitleSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import {
    mapFrom,
    withStrictNullCheck,
    type RecursiveReadonly,
} from "@/utils/schema";

export type UpdateMultiEnduranceSettingArgsEncoded = Readonly<
    Database["public"]["CompositeTypes"]["update_multi_endurance_setting_args"]
>;

export type UpdateMultiEnduranceSettingArgs = Readonly<{
    id: typeof MultiEnduranceSettingsSchema.Type.id;
    label: typeof MultiEnduranceSettingsSchema.Type.label;
    position: typeof MultiEnduranceSettingsSchema.Type.position;
    target_count: typeof MultiEnduranceSettingsSchema.Type.target_count;
}>;

export const UpdateMultiEnduranceSettingArgsSchema: Schema.Schema<
    UpdateMultiEnduranceSettingArgs,
    UpdateMultiEnduranceSettingArgsEncoded
> = Schema.Struct({
    id: withStrictNullCheck(MultiEnduranceSettingsIdSchema),
    label: withStrictNullCheck(MultiEnduranceLabelSchema),
    position: withStrictNullCheck(MultiEndurancePositionSchema),
    target_count: withStrictNullCheck(MultiEnduranceTargetCountSchema),
});

export const UpdateMultiEnduranceSettingArgsChunkSchema = Schema.Chunk(
    UpdateMultiEnduranceSettingArgsSchema,
);

export type UpdateMultiEnduranceProjectArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["update_multi_endurance_project"]["Args"]
>;

export type UpdateMultiEnduranceProjectArgs = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
    title: typeof ProjectSchema.Type.title;
    settings: typeof UpdateMultiEnduranceSettingArgsChunkSchema.Type;
}>;

export const UpdateMultiEnduranceProjectArgsSchema: Schema.Schema<
    UpdateMultiEnduranceProjectArgs,
    UpdateMultiEnduranceProjectArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    settings: UpdateMultiEnduranceSettingArgsChunkSchema.pipe(
        mapFrom("p_settings"),
    ),
});

export type UpdateMultiEnduranceProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_multi_endurance_project"]["Returns"]
>;

export type UpdateMultiEnduranceProjectReturns = typeof ProjectSchema.Type.id;

export const UpdateMultiEnduranceProjectReturnsSchema: Schema.Schema<
    UpdateMultiEnduranceProjectReturns,
    UpdateMultiEnduranceProjectReturnsEncoded
> = ProjectIdSchema;
