import { pipe, Schema } from "effect";

import { EnterLogSchema } from "../tables/EnterLogs";
import { EnterUnitSchema } from "../tables/EnterUnit";

export const EnterLogDtoSchema = pipe(
    EnterLogSchema,
    Schema.pick("user_number", "user_name", "entered_at"),
);

export const EnterUnitDtoSchema = pipe(
    EnterUnitSchema,
    Schema.pick(
        "id",
        "status",
        "event_date",
        "enter_count",
        "started_at",
        "completed_at",
    ),
    Schema.extend(
        Schema.Struct({
            logs: Schema.Chunk(EnterLogDtoSchema),
        }),
    ),
);

export type EnterUnitDto = typeof EnterUnitDtoSchema.Type;
export type EnterUnitDtoEncoded = typeof EnterUnitDtoSchema.Encoded;
