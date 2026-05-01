import { pipe, Schema } from "effect";

import { EnterUnitSchema } from "../tables/EnterUnit";

import {
    ProjectIdSchema,
    ProjectTitleSchema,
} from "@/domain/projects/tables/Project";

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
);

export const EnterProjectDtoSchema = Schema.Struct({
    id: ProjectIdSchema,
    title: ProjectTitleSchema,
    units: Schema.Chunk(EnterUnitDtoSchema),
});

export type EnterProjectDto = typeof EnterProjectDtoSchema.Type;
export type EnterProjectDtoEncoded = typeof EnterProjectDtoSchema.Encoded;
