import { Schema } from "effect";

import {
    EnterUnitIdSchema,
    EventDateSchema,
    type EnterUnitSchema,
} from "../tables/EnterUnit";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type CreateEnterUnitArgsEncoded = Readonly<
    Database["public"]["Functions"]["create_enter_unit"]["Args"]
>;
export type CreateEnterUnitArgs = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
    event_date: typeof EnterUnitSchema.Type.event_date;
}>;
export const CreateEnterUnitArgsSchema: Schema.Schema<
    CreateEnterUnitArgs,
    CreateEnterUnitArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    event_date: EventDateSchema.pipe(mapFrom("p_event_date")),
});

export type CreateEnterUnitReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_enter_unit"]["Returns"]
>;
export type CreateEnterUnitReturns = typeof EnterUnitSchema.Type.id;
export const CreateEnterUnitReturnsSchema: Schema.Schema<
    CreateEnterUnitReturns,
    CreateEnterUnitReturnsEncoded
> = EnterUnitIdSchema;
