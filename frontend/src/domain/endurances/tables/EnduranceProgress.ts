import { Schema } from "effect";

import { ProjectIdSchema, ProjectSchema } from "../../projects/tables/Project";

import type { Database } from "@/lib/database.types";

export type EnduranceProgressEncoded = Readonly<
    Database["public"]["Tables"]["endurance_progress"]["Row"]
>;

const EnduranceProgressId = Schema.UUID.pipe(
    Schema.brand("EnduranceProgressId"),
);

export const EnduranceCurrentCountSchema = Schema.Number.pipe(
    Schema.int(),
    Schema.brand("EnduranceCurrentCount"),
);

export type EnduranceProgress = Readonly<{
    id: typeof EnduranceProgressId.Type;
    project_id: typeof ProjectSchema.Type.id;
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
    current_count: EnduranceCurrentCountSchema,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
