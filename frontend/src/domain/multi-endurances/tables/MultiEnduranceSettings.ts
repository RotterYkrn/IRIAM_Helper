import { Schema } from "effect";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

export type MultiEnduranceSettingsEncoded = Readonly<
    Database["public"]["Tables"]["multi_endurance_settings"]["Row"]
>;

export const MultiEnduranceSettingsIdSchema = Schema.UUID.pipe(
    Schema.brand("MultiEnduranceSettingsId"),
);

export const MultiEndurancePositionSchema = Schema.Number.pipe(
    Schema.int(),
    Schema.greaterThanOrEqualTo(0),
    Schema.brand("MultiEndurancePosition"),
);

export const MultiEnduranceLabelSchema = Schema.String.pipe(
    Schema.minLength(1, {
        message: () => "1文字以上入力してください",
    }),
    Schema.brand("MultiEnduranceLabel"),
);

export const MultiEnduranceTargetCountSchema = Schema.Number.pipe(
    Schema.int({ message: () => "整数で入力してください" }),
    Schema.greaterThanOrEqualTo(1, {
        message: () => "1以上の数を入力してください",
    }),
    Schema.brand("MultiEnduranceTargetCount"),
);

export type MultiEnduranceSettings = Readonly<{
    id: typeof MultiEnduranceSettingsIdSchema.Type;
    project_id: typeof ProjectSchema.Type.id;
    position: typeof MultiEndurancePositionSchema.Type;
    label: typeof MultiEnduranceLabelSchema.Type;
    target_count: typeof MultiEnduranceTargetCountSchema.Type;
    created_at: Date;
    updated_at: Date;
}>;

export const MultiEnduranceSettingsSchema: Schema.Schema<
    MultiEnduranceSettings,
    MultiEnduranceSettingsEncoded
> = Schema.Struct({
    id: MultiEnduranceSettingsIdSchema,
    project_id: ProjectIdSchema,
    position: MultiEndurancePositionSchema,
    label: MultiEnduranceLabelSchema,
    target_count: MultiEnduranceTargetCountSchema,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
