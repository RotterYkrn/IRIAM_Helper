import { Schema, pipe, Effect } from "effect";

import {
    FinishProjectArgsSchema,
    FinishProjectReturnsSchema,
    type FinishProjectArgsEncoded,
} from "@/domain/projects/rpcs/FinishProject";
import { supabase } from "@/lib/supabase";

/**
 * 企画を終了状態にします。
 * @param args rpcに渡す引数
 * @returns 終了状態にした企画のID
 */
export const finishProject = (args: FinishProjectArgsEncoded) =>
    pipe(
        args,
        Schema.decodeEither(FinishProjectArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "finish_project",
                    Schema.encodeSync(FinishProjectArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeUnknownEither(FinishProjectReturnsSchema)),
    );
