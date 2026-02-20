import { Schema } from "effect";

import {
    MultiEnduranceCurrentCountSchema,
    type MultiEnduranceProgressSchema,
} from "../tables/MultiEnduranceProgress";
import {
    MultiEnduranceLabelSchema,
    MultiEndurancePositionSchema,
    MultiEnduranceSettingsIdSchema,
    MultiEnduranceTargetCountSchema,
    type MultiEnduranceSettingsSchema,
} from "../tables/MultiEnduranceSettings";

import type { Database } from "@/lib/database.types";
import { withStrictNullCheck } from "@/utils/schema";

export type MultiEnduranceStatEncoded = Readonly<
    Database["public"]["CompositeTypes"]["multi_endurance_stat"]
>;

export type MultiEnduranceStat = {
    id: typeof MultiEnduranceSettingsSchema.Type.id;
    position: typeof MultiEnduranceSettingsSchema.Type.position;
    label: typeof MultiEnduranceSettingsSchema.Type.label;
    target_count: typeof MultiEnduranceSettingsSchema.Type.target_count;
    current_count: typeof MultiEnduranceProgressSchema.Type.current_count;
};

export const MultiEnduranceStatSchema: Schema.Schema<
    MultiEnduranceStat,
    MultiEnduranceStatEncoded
> = Schema.Struct({
    id: withStrictNullCheck(MultiEnduranceSettingsIdSchema),
    position: withStrictNullCheck(MultiEndurancePositionSchema),
    label: withStrictNullCheck(MultiEnduranceLabelSchema),
    target_count: withStrictNullCheck(MultiEnduranceTargetCountSchema),
    current_count: withStrictNullCheck(MultiEnduranceCurrentCountSchema),
});
