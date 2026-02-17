import { Schema } from "effect";

import {
    MultiEnduranceSettingsIdSchema,
    type MultiEnduranceSettingsSchema,
} from "../tables/MultiEnduranceSettings";

import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type IncrementMultiEnduranceArgsEncoded = Readonly<
    Database["public"]["Functions"]["increment_multi_endurance"]["Args"]
>;

export const IncrementMultiEnduranceIsReversalSchema = Schema.Boolean.pipe(
    Schema.brand("IncrementMultiEnduranceIsReversal"),
);

export type IncrementMultiEnduranceArgs = Readonly<{
    setting_id: typeof MultiEnduranceSettingsSchema.Type.id;
    is_reversal: typeof IncrementMultiEnduranceIsReversalSchema.Type;
}>;

export const IncrementMultiEnduranceArgsSchema: Schema.Schema<
    IncrementMultiEnduranceArgs,
    IncrementMultiEnduranceArgsEncoded
> = Schema.Struct({
    setting_id: MultiEnduranceSettingsIdSchema.pipe(mapFrom("p_setting_id")),
    is_reversal: IncrementMultiEnduranceIsReversalSchema.pipe(
        mapFrom("p_is_reversal"),
    ),
});

export type IncrementMultiEnduranceReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_multi_endurance_project"]["Returns"]
>;

export type IncrementMultiEnduranceReturns =
    typeof MultiEnduranceSettingsSchema.Type.id;

export const IncrementMultiEnduranceReturnsSchema: Schema.Schema<
    IncrementMultiEnduranceReturns,
    IncrementMultiEnduranceReturnsEncoded
> = MultiEnduranceSettingsIdSchema;
