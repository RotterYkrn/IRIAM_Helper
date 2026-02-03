import { Schema } from "effect";

import { ProjectIdSchema, ProjectSchema } from "../../projects/tables/Project";

import type { Database } from "@/lib/database.types";

export type EnduranceSettingsEncoded = Readonly<
    Database["public"]["Tables"]["endurance_settings"]["Row"]
>;

const EnduranceSettingsId = Schema.UUID.pipe(
    Schema.brand("EnduranceSettingsId"),
);

export type EnduranceSettings = Readonly<{
    id: typeof EnduranceSettingsId.Type;
    project_id: typeof ProjectSchema.Type.id;
    target_count: number;
    increment_per_action: number;
    created_at: Date;
    updated_at: Date;
}>;

export const EnduranceSettingsSchema: Schema.Schema<
    EnduranceSettings,
    EnduranceSettingsEncoded
> = Schema.Struct({
    id: EnduranceSettingsId,
    project_id: ProjectIdSchema,
    target_count: Schema.Number,
    increment_per_action: Schema.Number,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
