import { pipe, Effect, Schema } from "effect";

import {
    type ArchiveEnterUnitArgs,
    ArchiveEnterUnitArgsSchema,
    ArchiveEnterUnitReturnsSchema,
} from "@/domain/enter_endurances/rpcs/ArchiveEnterUnit";
import { supabase } from "@/lib/supabase";

export const archiveEnterUnit = (args: ArchiveEnterUnitArgs) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "archive_enter_unit",
                    Schema.encodeSync(ArchiveEnterUnitArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(ArchiveEnterUnitReturnsSchema)),
    );
