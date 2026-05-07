import { Schema } from "effect";

import { EnterUnitSchema, EnterUnitIdSchema } from "../tables/EnterUnit";

import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type ArchiveEnterUnitArgsEncoded = Readonly<
    Database["public"]["Functions"]["archive_enter_unit"]["Args"]
>;
export type ArchiveEnterUnitArgs = Readonly<{
    unit_id: typeof EnterUnitSchema.Type.id;
}>;

export const ArchiveEnterUnitArgsSchema: Schema.Schema<
    ArchiveEnterUnitArgs,
    ArchiveEnterUnitArgsEncoded
> = Schema.Struct({
    unit_id: EnterUnitIdSchema.pipe(mapFrom("p_unit_id")),
});

export type ArchiveEnterUnitReturnsEncoded = Readonly<
    Database["public"]["Functions"]["archive_enter_unit"]["Returns"]
>;
export type ArchiveEnterUnitReturns = typeof EnterUnitSchema.Type.id;
export const ArchiveEnterUnitReturnsSchema: Schema.Schema<
    ArchiveEnterUnitReturns,
    ArchiveEnterUnitReturnsEncoded
> = EnterUnitIdSchema;
