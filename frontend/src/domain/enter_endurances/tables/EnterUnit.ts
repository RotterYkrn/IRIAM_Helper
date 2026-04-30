import { Schema } from "effect";

import {
    ProjectIdSchema,
    ProjectStatusSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

export type EnterUnitEncoded = Readonly<
    Database["public"]["Tables"]["enter_units"]["Row"]
>;

export const EnterUnitIdSchema = Schema.UUID.pipe(Schema.brand("EnterUnitId"));

export const EventDateSchema = Schema.String.pipe(
    Schema.pattern(/^\d{4}-\d{2}-\d{2}$/),
    Schema.brand("EventDate"),
);

export type EnterUnit = Readonly<{
    id: typeof EnterUnitIdSchema.Type;
    project_id: typeof ProjectSchema.Type.id;
    status: typeof ProjectStatusSchema.Type;
    event_date: typeof EventDateSchema.Type;
    started_at: Date | null;
    completed_at: Date | null;
    created_at: Date;
    updated_at: Date;
}>;

export const EnterUnitSchema: Schema.Schema<EnterUnit, EnterUnitEncoded> =
    Schema.Struct({
        id: EnterUnitIdSchema,
        project_id: ProjectIdSchema,
        status: ProjectStatusSchema,
        event_date: EventDateSchema,
        started_at: Schema.NullOr(Schema.Date),
        completed_at: Schema.NullOr(Schema.Date),
        created_at: Schema.Date,
        updated_at: Schema.Date,
    });
