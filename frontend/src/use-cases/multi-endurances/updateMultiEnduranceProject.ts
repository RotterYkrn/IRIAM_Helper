import { pipe, Effect, Schema } from "effect";

import {
    type UpdateMultiEnduranceProjectArgs,
    UpdateMultiEnduranceProjectArgsSchema,
    UpdateMultiEnduranceProjectReturnsSchema,
} from "@/domain/multi-endurances/rpcs/UpdateMultiEnduranceProject";
import { supabase } from "@/lib/supabase";

export const updateMultiEnduranceProject = (
    args: UpdateMultiEnduranceProjectArgs,
) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "update_multi_endurance_project",
                    // 要求される型に readonly がついておらず渡すことができないため、
                    // encodeSync を通したうえで any を使っています。
                    Schema.encodeSync(UpdateMultiEnduranceProjectArgsSchema)(
                        args,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ) as any,
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(
                UpdateMultiEnduranceProjectReturnsSchema,
            ),
        ),
    );
