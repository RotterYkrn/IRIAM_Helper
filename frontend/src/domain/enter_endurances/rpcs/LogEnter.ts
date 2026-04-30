import { Schema } from "effect";

import { EnterUserNameSchema, type EnterLogSchema } from "../tables/EnterLogs";
import { EnterUnitIdSchema, type EnterUnitSchema } from "../tables/EnterUnit";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type LogEnterArgsEncoded = Readonly<
    Database["public"]["Functions"]["log_enter"]["Args"]
>;
export type LogEnterArgs = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
    unit_id: typeof EnterUnitSchema.Type.id;
    user_name: typeof EnterLogSchema.Type.user_name;
    entered_at: typeof EnterLogSchema.Type.entered_at;
}>;
export const LogEnterArgsSchema: Schema.Schema<
    LogEnterArgs,
    LogEnterArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    unit_id: EnterUnitIdSchema.pipe(mapFrom("p_unit_id")),
    user_name: EnterUserNameSchema.pipe(mapFrom("p_user_name")),
    entered_at: Schema.Date.pipe(mapFrom("p_entered_at")),
});
