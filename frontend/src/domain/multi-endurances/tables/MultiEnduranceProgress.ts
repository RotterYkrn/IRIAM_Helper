import { Schema } from "effect";

import {
    MultiEnduranceSettingsIdSchema,
    type MultiEnduranceSettingsSchema,
} from "./MultiEnduranceSettings";

import type { Database } from "@/lib/database.types";

export type MultiEnduranceProgressEncoded = Readonly<
    Database["public"]["Tables"]["multi_endurance_progress"]["Row"]
>;

export const MultiEnduranceProgressIdSchema = Schema.UUID.pipe(
    Schema.brand("MultiEnduranceProgressId"),
);

export const MultiEnduranceCurrentCountSchema = Schema.NonNegativeInt.pipe(
    Schema.brand("MultiEnduranceCurrentCount"),
);

export type MultiEnduranceProgress = Readonly<{
    id: typeof MultiEnduranceProgressIdSchema.Type;
    setting_id: typeof MultiEnduranceSettingsSchema.Type.id;
    current_count: typeof MultiEnduranceCurrentCountSchema.Type;
    created_at: Date;
    updated_at: Date;
}>;

export const MultiEnduranceProgressSchema: Schema.Schema<
    MultiEnduranceProgress,
    MultiEnduranceProgressEncoded
> = Schema.Struct({
    id: MultiEnduranceProgressIdSchema,
    setting_id: MultiEnduranceSettingsIdSchema,
    current_count: MultiEnduranceCurrentCountSchema,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
