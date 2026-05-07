import { Schema } from "effect";

import {
    EnterUserNameSchema,
    EnterUserNumberSchema,
    type EnterLogSchema,
} from "../tables/EnterLogs";
import {
    EnterCountSchema,
    EnterUnitIdSchema,
    type EnterUnitSchema,
} from "../tables/EnterUnit";

import type { Database } from "@/lib/database.types";
import {
    mapFrom,
    withStrictNullCheck,
    type RecursiveReadonly,
} from "@/utils/schema";

export type ArchiveLogArgsEncoded = Readonly<
    Database["public"]["CompositeTypes"]["archive_log_args"]
>;
export type ArchiveLogArgs = Readonly<{
    user_number: typeof EnterLogSchema.Type.user_number;
    user_name: typeof EnterLogSchema.Type.user_name;
}>;
export const ArchiveLogArgsSchema: Schema.Schema<
    ArchiveLogArgs,
    ArchiveLogArgsEncoded
> = Schema.Struct({
    user_number: withStrictNullCheck(EnterUserNumberSchema),
    user_name: withStrictNullCheck(EnterUserNameSchema),
});
export const ArchiveLogArgsChunkSchema = Schema.Chunk(ArchiveLogArgsSchema);

export type ArchiveEnterLogsArgsEncoded = RecursiveReadonly<
    Database["public"]["Functions"]["archive_enter_logs"]["Args"]
>;
export type ArchiveEnterLogsArgs = Readonly<{
    unit_id: typeof EnterUnitSchema.Type.id;
    enter_count: typeof EnterUnitSchema.Type.enter_count;
    started_at: Date;
    completed_at: Date;
    logs: typeof ArchiveLogArgsChunkSchema.Type;
}>;
export const ArchiveEnterLogsArgsSchema: Schema.Schema<
    ArchiveEnterLogsArgs,
    ArchiveEnterLogsArgsEncoded
> = Schema.Struct({
    unit_id: EnterUnitIdSchema.pipe(mapFrom("p_unit_id")),
    enter_count: EnterCountSchema.pipe(mapFrom("p_enter_count")),
    started_at: Schema.Date.pipe(mapFrom("p_started_at")),
    completed_at: Schema.Date.pipe(mapFrom("p_completed_at")),
    logs: ArchiveLogArgsChunkSchema.pipe(mapFrom("p_logs")),
});

export type ArchiveEnterLogsReturnsEncoded = Readonly<
    Database["public"]["Functions"]["archive_enter_logs"]["Returns"]
>;
export type ArchiveEnterLogsReturns = typeof EnterUnitSchema.Type.id;
export const ArchiveEnterLogsReturnsSchema: Schema.Schema<
    ArchiveEnterLogsReturns,
    ArchiveEnterLogsReturnsEncoded
> = EnterUnitIdSchema;
