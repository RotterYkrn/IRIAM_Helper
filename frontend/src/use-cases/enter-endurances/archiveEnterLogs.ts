import { pipe, Effect, Schema } from "effect";

import {
    type ArchiveEnterLogsArgs,
    ArchiveEnterLogsArgsSchema,
    ArchiveEnterLogsReturnsSchema,
} from "@/domain/enter_endurances/rpcs/ArchiveEnterLogs";
import { supabase } from "@/lib/supabase";

export const archiveEnterLogs = (args: ArchiveEnterLogsArgs) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "archive_enter_logs",
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Schema.encodeSync(ArchiveEnterLogsArgsSchema)(args) as any,
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(ArchiveEnterLogsReturnsSchema)),
    );
