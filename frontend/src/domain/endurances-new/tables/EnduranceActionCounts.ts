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

export type EnduranceActionCountsEncoded = Readonly<
    Database["public"]["Tables"]["endurance_action_counts"]["Row"]
>;

export const EnduranceActionCountIdSchema = Schema.UUID.pipe(
    Schema.brand("EnduranceActionCountId"),
);

export const EnduranceNormalCountSchema = Schema.NonNegative.pipe(
    Schema.brand("EnduranceNormalCount"),
);

export const EnduranceRescueCountSchema = Schema.NonNegative.pipe(
    Schema.brand("EnduranceRescueCount"),
);

export const EnduranceSabotageCountSchema = Schema.NonNegative.pipe(
    Schema.brand("EnduranceSabotageCount"),
);

export type EnduranceActionCounts = {
    id: typeof EnduranceActionCountIdSchema.Type;
    project_id: typeof ProjectSchema.Type.id;
    unit_id: typeof EnduranceUnitsSchema.Type.id;
    normal_count: typeof EnduranceNormalCountSchema.Type;
    rescue_count: typeof EnduranceRescueCountSchema.Type;
    sabotage_count: typeof EnduranceSabotageCountSchema.Type;
    created_at: Date;
    updated_at: Date;
};

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
