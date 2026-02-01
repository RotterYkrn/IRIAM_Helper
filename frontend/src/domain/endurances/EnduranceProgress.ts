import { Schema } from "effect";

import { ProjectIdSchema, ProjectSchema } from "../projects/Project";

import type { Database } from "@/lib/database.types";

export type EnduranceProgressEncoded = Readonly<
    Database["public"]["Tables"]["endurance_progress"]["Row"]
>;

const EnduranceProgressId = Schema.UUID.pipe(
    Schema.brand("EnduranceProgressId"),
);

export type EnduranceProgress = Readonly<{
    id: typeof EnduranceProgressId.Type;
    project_id: typeof ProjectSchema.Type.id;
    current_count: number;
    created_at: Date;
    updated_at: Date;
}>;

export const EnduranceProgressSchema: Schema.Schema<
    EnduranceProgress,
    EnduranceProgressEncoded
> = Schema.Struct({
    id: EnduranceProgressId,
    project_id: ProjectIdSchema,
    current_count: Schema.Number,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
