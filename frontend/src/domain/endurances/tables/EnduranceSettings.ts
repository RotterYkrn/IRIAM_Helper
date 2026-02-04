import { Schema } from "effect";

import { ProjectIdSchema, ProjectSchema } from "../../projects/tables/Project";

import type { Database } from "@/lib/database.types";

export type EnduranceSettingsEncoded = Readonly<
    Database["public"]["Tables"]["endurance_settings"]["Row"]
>;

const EnduranceSettingsId = Schema.UUID.pipe(
    Schema.brand("EnduranceSettingsId"),
);

export const EnduranceTargetCountSchema = Schema.Number.pipe(
    Schema.int({ message: () => "整数で入力してください" }),
    Schema.greaterThanOrEqualTo(1, {
        message: () => "1以上の数を入力してください",
    }),
    Schema.brand("EnduranceTargetCount"),
);

export const EnduranceIncrementPerActionSchema = Schema.Number.pipe(
    Schema.int({ message: () => "整数で入力してください" }),
    Schema.greaterThanOrEqualTo(1, {
        message: () => "1以上の数を入力してください",
    }),
    Schema.brand("EnduranceIncrementPerAction"),
);

export type EnduranceSettings = Readonly<{
    id: typeof EnduranceSettingsId.Type;
    project_id: typeof ProjectSchema.Type.id;
    target_count: typeof EnduranceTargetCountSchema.Type;
    increment_per_action: typeof EnduranceIncrementPerActionSchema.Type;
    created_at: Date;
    updated_at: Date;
}>;

export const EnduranceSettingsSchema: Schema.Schema<
    EnduranceSettings,
    EnduranceSettingsEncoded
> = Schema.Struct({
    id: EnduranceSettingsId,
    project_id: ProjectIdSchema,
    target_count: EnduranceTargetCountSchema,
    increment_per_action: EnduranceIncrementPerActionSchema,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
