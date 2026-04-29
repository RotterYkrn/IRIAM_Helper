import { Effect, Schema, pipe } from "effect";

import {
    CreateMultiEnduranceProjectArgsSchema,
    CreateMultiEnduranceProjectReturnsSchema,
    type CreateMultiEnduranceProjectArgs,
} from "@/domain/multi-endurances/rpcs/CreateMultiEnduranceProject";
import { supabase } from "@/lib/supabase";

export const createMultiEnduranceProject = (
    args: CreateMultiEnduranceProjectArgs,
) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "create_multi_endurance_project",
                    // 要求される型に readonly がついておらず渡すことができないため、
                    // encodeSync を通したうえで any を使っています。
                    Schema.encodeSync(CreateMultiEnduranceProjectArgsSchema)(
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
                CreateMultiEnduranceProjectReturnsSchema,
            ),
        ),
    );
