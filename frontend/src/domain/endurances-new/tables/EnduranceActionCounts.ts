import { Schema } from "effect";

import {
    EnduranceUnitIdSchema,
    type EnduranceUnitsSchema,
} from "./EnduranceUnits";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

/** {@link EnduranceActionCountsSchema} */
export type EnduranceActionCountsEncoded = Readonly<
    Database["public"]["Tables"]["endurance_action_counts"]["Row"]
>;

export const EnduranceActionCountIdSchema = Schema.UUID.pipe(
    Schema.brand("EnduranceActionCountId"),
);

/** 耐久対象のカウント */
export const EnduranceNormalCountSchema = Schema.NonNegative.pipe(
    Schema.brand("EnduranceNormalCount"),
);

/** 救済の総カウント */
export const EnduranceRescueCountSchema = Schema.NonNegative.pipe(
    Schema.brand("EnduranceRescueCount"),
);

/** 妨害の総カウント */
export const EnduranceSabotageCountSchema = Schema.NonNegative.pipe(
    Schema.brand("EnduranceSabotageCount"),
);

/** {@link EnduranceActionCountsSchema} */
export type EnduranceActionCounts = {
    id: typeof EnduranceActionCountIdSchema.Type;

    project_id: typeof ProjectSchema.Type.id;

    unit_id: typeof EnduranceUnitsSchema.Type.id;

    /** {@link EnduranceNormalCountSchema} */
    normal_count: typeof EnduranceNormalCountSchema.Type;

    /** {@link EnduranceRescueCountSchema} */
    rescue_count: typeof EnduranceRescueCountSchema.Type;

    /** {@link EnduranceSabotageCountSchema} */
    sabotage_count: typeof EnduranceSabotageCountSchema.Type;

    created_at: Date;

    updated_at: Date;
};

/**
 * endurance_action_countsテーブル\
 * 耐久対象のカウント、救済の総カウント、妨害の総カウント
 */
export const EnduranceActionCountsSchema: Schema.Schema<
    EnduranceActionCounts,
    EnduranceActionCountsEncoded
> = Schema.Struct({
    id: EnduranceActionCountIdSchema,
    project_id: ProjectIdSchema,
    unit_id: EnduranceUnitIdSchema,
    normal_count: EnduranceNormalCountSchema,
    rescue_count: EnduranceRescueCountSchema,
    sabotage_count: EnduranceSabotageCountSchema,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
