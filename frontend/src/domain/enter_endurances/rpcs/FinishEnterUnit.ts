import { Schema } from "effect";

import { EnterUnitIdSchema, EnterUnitSchema } from "../tables/EnterUnit";

import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type FinishEnterUnitArgsEncoded = Readonly<
    Database["public"]["Functions"]["finish_enter_unit"]["Args"]
>;
export type FinishEnterUnitArgs = Readonly<{
    unitId: typeof EnterUnitSchema.Type.id;
}>;

export const FinishEnterUnitArgsSchema: Schema.Schema<
    FinishEnterUnitArgs,
    FinishEnterUnitArgsEncoded
> = Schema.Struct({
    unitId: EnterUnitIdSchema.pipe(mapFrom("p_unit_id")),
});

export type FinishEnterUnitReturnsEncoded = Readonly<
    Database["public"]["Functions"]["finish_enter_unit"]["Returns"]
>;
export type FinishEnterUnitReturns = typeof EnterUnitSchema.Type.id;
export const FinishEnterUnitReturnsSchema: Schema.Schema<
    FinishEnterUnitReturns,
    FinishEnterUnitReturnsEncoded
> = EnterUnitIdSchema;
