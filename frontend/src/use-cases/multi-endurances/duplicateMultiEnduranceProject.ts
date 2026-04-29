import { pipe, Effect, Schema } from "effect";

import {
    type DuplicateMultiEnduranceProjectArgs,
    DuplicateMultiEnduranceProjectArgsSchema,
    DuplicateMultiEnduranceProjectReturnsSchema,
} from "@/domain/multi-endurances/rpcs/DuplicateMultiEnduranceProject";
import { supabase } from "@/lib/supabase";

/**
 * 耐久企画（複数）を複製します。
 * @param args rpcに渡す引数
 * @returns 複製した企画のID
 */
export const duplicateMultiEnduranceProject = (
    args: DuplicateMultiEnduranceProjectArgs,
) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "duplicate_multi_endurance_project",
                    Schema.encodeSync(DuplicateMultiEnduranceProjectArgsSchema)(
                        args,
                    ),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeEither(DuplicateMultiEnduranceProjectReturnsSchema),
        ),
    );
