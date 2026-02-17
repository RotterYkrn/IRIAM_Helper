import { Schema } from "effect";

import {
    MultiEnduranceLabelSchema,
    MultiEndurancePositionSchema,
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

export type CreateMultiEnduranceSettingArgsEncoded = Readonly<
    Database["public"]["CompositeTypes"]["create_multi_endurance_setting_args"]
>;

export type CreateMultiEnduranceSettingArgs = Readonly<{
    label: typeof MultiEnduranceSettingsSchema.Type.label;
    position: typeof MultiEnduranceSettingsSchema.Type.position;
    target_count: typeof MultiEnduranceSettingsSchema.Type.target_count;
}>;

export const CreateMultiEnduranceSettingArgsSchema: Schema.Schema<
    CreateMultiEnduranceSettingArgs,
    CreateMultiEnduranceSettingArgsEncoded
> = Schema.Struct({
    label: withStrictNullCheck(MultiEnduranceLabelSchema),
    position: withStrictNullCheck(MultiEndurancePositionSchema),
    target_count: withStrictNullCheck(MultiEnduranceTargetCountSchema),
});

export const CreateMultiEnduranceSettingArgsChunkSchema = Schema.Chunk(
    CreateMultiEnduranceSettingArgsSchema,
);

export type CreateMultiEnduranceProjectArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["create_multi_endurance_project"]["Args"]
>;

export type CreateMultiEnduranceProjectArgs = Readonly<{
    title: typeof ProjectSchema.Type.title;
    settings: typeof CreateMultiEnduranceSettingArgsChunkSchema.Type;
}>;

export const CreateMultiEnduranceProjectArgsSchema: Schema.Schema<
    CreateMultiEnduranceProjectArgs,
    CreateMultiEnduranceProjectArgsEncoded
> = Schema.Struct({
    title: ProjectTitleSchema.pipe(mapFrom("p_title")),
    settings: CreateMultiEnduranceSettingArgsChunkSchema.pipe(
        mapFrom("p_settings"),
    ),
});

export type CreateMultiEnduranceProjectReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_multi_endurance_project"]["Returns"]
>;

export type CreateMultiEnduranceProjectReturns = typeof ProjectSchema.Type.id;

export const CreateMultiEnduranceProjectReturnsSchema: Schema.Schema<
    CreateMultiEnduranceProjectReturns,
    CreateMultiEnduranceProjectReturnsEncoded
> = ProjectIdSchema;
