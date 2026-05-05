import { Schema } from "effect";

import { EnterUnitIdSchema, EnterUnitSchema } from "../tables/EnterUnit";

import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type ActivateEnterUnitArgsEncoded = Readonly<
    Database["public"]["Functions"]["activate_enter_unit"]["Args"]
>;
export type ActivateEnterUnitArgs = Readonly<{
    id: typeof EnterUnitSchema.Type.id;
    started_at: Date;
}>;

export const ActivateEnterUnitArgsSchema: Schema.Schema<
    ActivateEnterUnitArgs,
    ActivateEnterUnitArgsEncoded
> = Schema.Struct({
    id: EnterUnitIdSchema.pipe(mapFrom("p_unit_id")),
    started_at: Schema.Date.pipe(mapFrom("p_started_at")),
});

export type ActivateEnterUnitReturnsEncoded = Readonly<
    Database["public"]["Functions"]["activate_enter_unit"]["Returns"]
>;
export type ActivateEnterUnitReturns = typeof EnterUnitSchema.Type.id;
export const ActivateEnterUnitReturnsSchema: Schema.Schema<
    ActivateEnterUnitReturns,
    ActivateEnterUnitReturnsEncoded
> = EnterUnitIdSchema;
