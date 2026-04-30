import { Schema } from "effect";

import { EnterUnitIdSchema, type EnterUnitSchema } from "./EnterUnit";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

export type EnterLogEncoded = Readonly<
    Database["public"]["Tables"]["enter_logs"]["Row"]
>;

export const EnterLogIdSchema = Schema.UUID.pipe(Schema.brand("EnterLogId"));

export const EnterUserNameSchema = Schema.String.pipe(
    Schema.minLength(1, {
        message: () => "1文字以上入力してください",
    }),
    Schema.brand("EnterUserName"),
);

export type EnterLog = Readonly<{
    id: typeof EnterLogIdSchema.Type;
    project_id: typeof ProjectSchema.Type.id;
    unit_id: typeof EnterUnitSchema.Type.id;
    user_name: typeof EnterUserNameSchema.Type;
    entered_at: Date;
}>;

export const EnterLogSchema: Schema.Schema<EnterLog, EnterLogEncoded> =
    Schema.Struct({
        id: EnterLogIdSchema,
        project_id: ProjectIdSchema,
        unit_id: EnterUnitIdSchema,
        user_name: EnterUserNameSchema,
        entered_at: Schema.Date,
    });
