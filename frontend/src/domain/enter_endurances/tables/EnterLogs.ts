import { Schema } from "effect";

import { EnterUnitIdSchema, type EnterUnitSchema } from "./EnterUnit";

import type { Database } from "@/lib/database.types";

export type EnterLogEncoded = Readonly<
    Database["public"]["Tables"]["enter_logs"]["Row"]
>;

export const EnterLogIdSchema = Schema.UUID.pipe(Schema.brand("EnterLogId"));

export const EnterUserNumberSchema = Schema.Int.pipe(Schema.positive());

export const EnterUserNameSchema = Schema.String.pipe(
    Schema.minLength(1, {
        message: () => "1文字以上入力してください",
    }),
    Schema.brand("EnterUserName"),
);

export type EnterLog = Readonly<{
    id: typeof EnterLogIdSchema.Type;
    unit_id: typeof EnterUnitSchema.Type.id;
    user_number: typeof EnterUserNumberSchema.Type;
    user_name: typeof EnterUserNameSchema.Type;
    entered_at: Date;
}>;

export const EnterLogSchema: Schema.Schema<EnterLog, EnterLogEncoded> =
    Schema.Struct({
        id: EnterLogIdSchema,
        unit_id: EnterUnitIdSchema,
        user_number: EnterUserNumberSchema,
        user_name: EnterUserNameSchema,
        entered_at: Schema.Date,
    });
