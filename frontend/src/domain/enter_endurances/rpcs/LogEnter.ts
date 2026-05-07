import { Schema } from "effect";

import { EnterUserNameSchema, type EnterLogSchema } from "../tables/EnterLogs";
import { EnterUnitIdSchema, type EnterUnitSchema } from "../tables/EnterUnit";

import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type LogEnterArgsEncoded = Readonly<
    Database["public"]["Functions"]["log_enter"]["Args"]
>;
export type LogEnterArgs = Readonly<{
    unit_id: typeof EnterUnitSchema.Type.id;
    user_number: typeof EnterLogSchema.Type.user_number;
    user_name: typeof EnterLogSchema.Type.user_name;
    entered_at: typeof EnterLogSchema.Type.entered_at;
}>;
export const LogEnterArgsSchema: Schema.Schema<
    LogEnterArgs,
    LogEnterArgsEncoded
> = Schema.Struct({
    unit_id: EnterUnitIdSchema.pipe(mapFrom("p_unit_id")),
    user_number: Schema.Int.pipe(mapFrom("p_user_number")),
    user_name: EnterUserNameSchema.pipe(mapFrom("p_user_name")),
    entered_at: Schema.Date.pipe(mapFrom("p_entered_at")),
});

export type LogEnterReturnsEncoded = Readonly<
    Database["public"]["Functions"]["log_enter"]["Returns"]
>;
export type LogEnterReturns = typeof EnterUnitSchema.Type.id;
export const LogEnterReturnsSchema: Schema.Schema<
    LogEnterReturns,
    LogEnterReturnsEncoded
> = EnterUnitIdSchema;
