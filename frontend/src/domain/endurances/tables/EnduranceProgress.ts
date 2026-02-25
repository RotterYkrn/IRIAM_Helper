import { Schema } from "effect";

import { ProjectIdSchema, ProjectSchema } from "../../projects/tables/Project";

import type { Database } from "@/lib/database.types";

export type EnduranceProgressEncoded = Readonly<
    Database["public"]["Tables"]["endurance_progress"]["Row"]
>;

const EnduranceProgressId = Schema.UUID.pipe(
    Schema.brand("EnduranceProgressId"),
);

export const EnduranceNormalCountSchema = Schema.Number.pipe(
    Schema.int(),
    Schema.brand("EnduranceNormalCount"),
);

export const EnduranceRescueCountSchema = Schema.Number.pipe(
    Schema.int(),
    Schema.brand("EnduranceRescueCount"),
);

export const EnduranceSabotageCountSchema = Schema.Number.pipe(
    Schema.int(),
    Schema.brand("EnduranceSabotageCount"),
);

export const EnduranceCurrentCountSchema = Schema.Number.pipe(
    Schema.int(),
    Schema.brand("EnduranceCurrentCount"),
);

export type EnduranceProgress = Readonly<{
    id: typeof EnduranceProgressId.Type;
    project_id: typeof ProjectSchema.Type.id;
    normal_count: typeof EnduranceNormalCountSchema.Type;
    rescue_count: typeof EnduranceRescueCountSchema.Type;
    sabotage_count: typeof EnduranceSabotageCountSchema.Type;
    current_count: typeof EnduranceCurrentCountSchema.Type;
    created_at: Date;
    updated_at: Date;
}>;

export const EnduranceProgressSchema: Schema.Schema<
    EnduranceProgress,
    EnduranceProgressEncoded
> = Schema.Struct({
    id: EnduranceProgressId,
    project_id: ProjectIdSchema,
    normal_count: EnduranceNormalCountSchema,
    rescue_count: EnduranceRescueCountSchema,
    sabotage_count: EnduranceSabotageCountSchema,
    current_count: EnduranceCurrentCountSchema,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
